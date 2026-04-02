import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { SEED_PLAYERS, SEED_EVENTS, SEED_MESSAGES } from '../data/seedData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [players, setPlayers] = useState(SEED_PLAYERS);
    const [events, setEvents] = useState(SEED_EVENTS);
    const [messages, setMessages] = useState(SEED_MESSAGES);
    const [loading, setLoading] = useState(true);
    const [useBackend, setUseBackend] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const user = await api.getCurrentUser();
                    setCurrentUser(user);
                    setUseBackend(true);
                    await loadBackendData();
                } catch (error) {
                    console.error('Auth check failed:', error);
                    api.logout();
                }
            } else {
                // Load from localStorage for demo mode
                const savedUser = localStorage.getItem('demo_user');
                if (savedUser) {
                    setCurrentUser(JSON.parse(savedUser));
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const loadBackendData = async () => {
        try {
            const [playersData, eventsData] = await Promise.all([
                api.searchPlayers(),
                api.getEvents(),
            ]);
            
            // Normalize players data to match frontend format
            const normalizedPlayers = playersData.map(player => ({
                id: player.id,
                name: player.full_name || player.username,
                email: player.email,
                username: player.username,
                city: player.city || '',
                sports: player.sports?.map(s => s.sport_name) || [],
                skillLevel: player.sports?.[0]?.skill_level || 'Beginner',
                availability: [], // Backend doesn't have this field yet
                bio: player.bio || '',
                avatar: player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
                matchesPlayed: 0,
                eventsJoined: 0,
            }));
            
            setPlayers(normalizedPlayers);
            setEvents(eventsData);
        } catch (error) {
            console.error('Failed to load backend data:', error);
        }
    };

    const login = async (email, password) => {
        try {
            // Try backend first - send email directly (backend accepts email or username)
            const response = await api.login(email, password);
            
            // Fetch complete user data with sports
            const completeUser = await api.getCurrentUser();
            
            // Normalize user data to match frontend expectations
            const normalizedUser = {
                id: completeUser.id,
                name: completeUser.full_name || completeUser.username,
                email: completeUser.email,
                username: completeUser.username,
                city: completeUser.city || '',
                sports: completeUser.sports?.map(s => s.sport_name) || [],
                skillLevel: completeUser.sports?.[0]?.skill_level || 'Beginner',
                availability: [],
                bio: completeUser.bio || '',
                avatar: completeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${completeUser.username}`,
                matchesPlayed: 0,
                eventsJoined: 0,
            };
            
            setCurrentUser(normalizedUser);
            setUseBackend(true);
            
            // Load backend data (players and events) after successful login
            await loadBackendData();
            
            return { success: true };
        } catch (error) {
            // Fallback to demo mode
            const user = SEED_PLAYERS.find(p => p.email === email && p.password === password);
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('demo_user', JSON.stringify(user));
                return { success: true };
            }
            return { success: false, error: error.message || 'Invalid email or password' };
        }
    };

    const signup = async (userData) => {
        try {
            // Try backend first
            const response = await api.register({
                username: userData.name.toLowerCase().replace(/\s/g, ''),
                email: userData.email,
                password: userData.password,
                full_name: userData.name,
                city: userData.city,
            });
            
            // Save sports to backend if provided
            if (userData.sports && userData.sports.length > 0) {
                for (const sportId of userData.sports) {
                    try {
                        await api.addUserSport({
                            sport_name: sportId,
                            skill_level: userData.skillLevel || 'Beginner'
                        });
                    } catch (error) {
                        console.error('Failed to add sport:', error);
                    }
                }
            }
            
            // Update bio and avatar if provided
            if (userData.bio || userData.avatar) {
                try {
                    await api.updateProfile({
                        bio: userData.bio,
                        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.username}`
                    });
                } catch (error) {
                    console.error('Failed to update profile:', error);
                }
            }
            
            // Fetch complete user data with sports
            const completeUser = await api.getCurrentUser();
            
            // Normalize user data to match frontend expectations
            const normalizedUser = {
                id: completeUser.id,
                name: completeUser.full_name || completeUser.username,
                email: completeUser.email,
                username: completeUser.username,
                city: completeUser.city || '',
                sports: completeUser.sports?.map(s => s.sport_name) || userData.sports || [],
                skillLevel: completeUser.sports?.[0]?.skill_level || userData.skillLevel || 'Beginner',
                availability: userData.availability || [],
                bio: completeUser.bio || userData.bio || '',
                avatar: completeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${completeUser.username}`,
                matchesPlayed: 0,
                eventsJoined: 0,
            };
            
            // Set user and backend mode
            setCurrentUser(normalizedUser);
            setUseBackend(true);
            
            // Load backend data (players and events) after successful signup
            await loadBackendData();
            
            return { success: true };
        } catch (error) {
            console.error('Backend registration failed:', error);
            
            // Return the actual error instead of falling back to demo mode
            return { 
                success: false, 
                error: error.message || 'Registration failed. Please try again.' 
            };
        }
    };

    const logout = () => {
        api.logout();
        setCurrentUser(null);
        setUseBackend(false);
        localStorage.removeItem('demo_user');
        setPlayers(SEED_PLAYERS);
        setEvents(SEED_EVENTS);
        setMessages(SEED_MESSAGES);
    };

    const updateProfile = async (data) => {
        if (useBackend) {
            try {
                // Update basic profile info
                const updated = await api.updateProfile({
                    full_name: data.name,
                    bio: data.bio,
                    city: data.city,
                });
                
                // Handle sports updates if provided
                if (data.sports) {
                    // Get current sports
                    const currentSports = await api.getUserSports();
                    const currentSportNames = currentSports.map(s => s.sport_name);
                    
                    // Find sports to add and remove
                    const sportsToAdd = data.sports.filter(s => !currentSportNames.includes(s));
                    const sportsToRemove = currentSports.filter(s => !data.sports.includes(s.sport_name));
                    
                    // Add new sports
                    for (const sportName of sportsToAdd) {
                        try {
                            await api.addUserSport({
                                sport_name: sportName,
                                skill_level: data.skillLevel || 'Beginner'
                            });
                        } catch (error) {
                            console.error('Failed to add sport:', error);
                        }
                    }
                    
                    // Remove old sports
                    for (const sport of sportsToRemove) {
                        try {
                            await api.deleteUserSport(sport.id);
                        } catch (error) {
                            console.error('Failed to remove sport:', error);
                        }
                    }
                }
                
                // Fetch updated user data
                const completeUser = await api.getCurrentUser();
                
                // Normalize and update current user
                const normalizedUser = {
                    id: completeUser.id,
                    name: completeUser.full_name || completeUser.username,
                    email: completeUser.email,
                    username: completeUser.username,
                    city: completeUser.city || '',
                    sports: completeUser.sports?.map(s => s.sport_name) || [],
                    skillLevel: completeUser.sports?.[0]?.skill_level || data.skillLevel || 'Beginner',
                    availability: data.availability || currentUser.availability || [],
                    bio: completeUser.bio || '',
                    avatar: completeUser.avatar || currentUser.avatar,
                    matchesPlayed: currentUser.matchesPlayed || 0,
                    eventsJoined: currentUser.eventsJoined || 0,
                };
                
                setCurrentUser(normalizedUser);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const updatedPlayers = players.map(p =>
                p.id === currentUser.id ? { ...p, ...data } : p
            );
            const updatedUser = updatedPlayers.find(p => p.id === currentUser.id);
            setPlayers(updatedPlayers);
            setCurrentUser(updatedUser);
            localStorage.setItem('demo_user', JSON.stringify(updatedUser));
            return { success: true };
        }
    };

    const createEvent = async (data) => {
        if (useBackend) {
            try {
                const newEvent = await api.createEvent(data);
                setEvents([...events, newEvent]);
                return { success: true, event: newEvent };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const newEvent = {
                id: 'e' + Date.now(),
                ...data,
                organizerId: currentUser.id,
                participants: [currentUser.id],
            };
            setEvents([...events, newEvent]);
            return { success: true, event: newEvent };
        }
    };

    const joinEvent = async (eventId) => {
        if (useBackend) {
            try {
                const response = await api.joinEvent(eventId);
                // Update event with new participant list from backend
                const updatedEvents = events.map(e =>
                    e.id === eventId ? { ...e, participants: response.participants } : e
                );
                setEvents(updatedEvents);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const updatedEvents = events.map(e => {
                if (e.id === eventId && !e.participants.includes(currentUser.id)) {
                    return { ...e, participants: [...e.participants, currentUser.id] };
                }
                return e;
            });
            setEvents(updatedEvents);
            return { success: true };
        }
    };

    const leaveEvent = async (eventId) => {
        if (useBackend) {
            try {
                const response = await api.leaveEvent(eventId);
                // Update event with new participant list from backend
                const updatedEvents = events.map(e =>
                    e.id === eventId ? { ...e, participants: response.participants } : e
                );
                setEvents(updatedEvents);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const leftEvents = events.map(e => {
                if (e.id === eventId) {
                    return { ...e, participants: e.participants.filter(id => id !== currentUser.id) };
                }
                return e;
            });
            setEvents(leftEvents);
            return { success: true };
        }
    };

    const sendMessage = async (receiverId, text) => {
        if (useBackend) {
            try {
                await api.sendMessage(receiverId, text);
                
                // Also update local state for immediate UI feedback
                const senderId = currentUser.id;
                const existingThread = messages.find(
                    m => (m.senderId === senderId && m.receiverId === receiverId) ||
                        (m.senderId === receiverId && m.receiverId === senderId)
                );

                const newMsg = {
                    id: 'msg' + Date.now(),
                    from: senderId,
                    text,
                    timestamp: new Date().toISOString(),
                };

                if (existingThread) {
                    const updatedMessages = messages.map(m =>
                        m.id === existingThread.id
                            ? { ...m, messages: [...m.messages, newMsg] }
                            : m
                    );
                    setMessages(updatedMessages);
                } else {
                    const newThread = {
                        id: 'm' + Date.now(),
                        senderId,
                        receiverId,
                        messages: [newMsg],
                    };
                    setMessages([...messages, newThread]);
                }
                
                return { success: true };
            } catch (error) {
                console.error('Send message error:', error);
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const senderId = currentUser.id;
            const existingThread = messages.find(
                m => (m.senderId === senderId && m.receiverId === receiverId) ||
                    (m.senderId === receiverId && m.receiverId === senderId)
            );

            const newMsg = {
                id: 'msg' + Date.now(),
                from: senderId,
                text,
                timestamp: new Date().toISOString(),
            };

            if (existingThread) {
                const updatedMessages = messages.map(m =>
                    m.id === existingThread.id
                        ? { ...m, messages: [...m.messages, newMsg] }
                        : m
                );
                setMessages(updatedMessages);
            } else {
                const newThread = {
                    id: 'm' + Date.now(),
                    senderId,
                    receiverId,
                    messages: [newMsg],
                };
                setMessages([...messages, newThread]);
            }
            return { success: true };
        }
    };

    const getPlayerById = (id) => {
        // First check if it's the current user
        if (currentUser && (currentUser.id === id || currentUser.id === parseInt(id))) {
            return currentUser;
        }
        // Then check in players array
        return players.find(p => p.id === id || p.id === parseInt(id));
    };

    const getThreadForUser = (userId) => {
        if (!currentUser) return null;
        return messages.find(
            m => (m.senderId === currentUser.id && m.receiverId === userId) ||
                (m.senderId === userId && m.receiverId === currentUser.id)
        );
    };

    const getUserThreads = () => {
        if (!currentUser) return [];
        return messages.filter(
            m => m.senderId === currentUser.id || m.receiverId === currentUser.id
        );
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            players,
            events,
            messages,
            loading,
            useBackend,
            login,
            signup,
            logout,
            updateProfile,
            createEvent,
            joinEvent,
            leaveEvent,
            sendMessage,
            getPlayerById,
            getThreadForUser,
            getUserThreads,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
