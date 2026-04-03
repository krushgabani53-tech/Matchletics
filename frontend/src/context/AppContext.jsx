import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { SEED_PLAYERS, SEED_EVENTS, SEED_MESSAGES } from '../data/seedData';
import { getCityLocation, getUserLocation } from '../utils/location';

const AppContext = createContext(null);

const normalizeBackendMessages = (backendMessages, currentUserId) => {
    const currentUserIdNumber = Number(currentUserId);
    const threadMap = new Map();

    const sortedMessages = [...backendMessages].sort(
        (left, right) => new Date(left.created_at) - new Date(right.created_at)
    );

    sortedMessages.forEach(message => {
        const senderId = Number(message.sender_id);
        const receiverId = Number(message.receiver_id);
        const otherUserId = senderId === currentUserIdNumber ? receiverId : senderId;
        const threadId = `thread-${otherUserId}`;

        if (!threadMap.has(threadId)) {
            threadMap.set(threadId, {
                id: threadId,
                senderId: currentUserIdNumber,
                receiverId: otherUserId,
                messages: [],
            });
        }

        const thread = threadMap.get(threadId);
        thread.messages.push({
            id: message.id,
            from: senderId,
            text: message.content,
            timestamp: message.created_at,
            isRead: message.is_read,
        });
    });

    return Array.from(threadMap.values()).sort((left, right) => {
        const leftLastMessage = left.messages[left.messages.length - 1];
        const rightLastMessage = right.messages[right.messages.length - 1];

        return new Date(rightLastMessage.timestamp) - new Date(leftLastMessage.timestamp);
    });
};

const normalizePlayerRecord = (player) => {
    const location = getUserLocation(player);
    const sports = Array.isArray(player.sports)
        ? player.sports
            .map((sport) => (typeof sport === 'string' ? sport : sport?.sport_name))
            .filter(Boolean)
        : [];
    const firstSport = Array.isArray(player.sports) ? player.sports[0] : null;
    const skillLevel = typeof firstSport === 'string'
        ? player.skillLevel || 'Beginner'
        : firstSport?.skill_level || player.skillLevel || 'Beginner';

    return {
        id: player.id,
        name: player.full_name || player.name || player.username,
        email: player.email,
        username: player.username,
        city: player.city || '',
        latitude: location?.latitude ?? player.latitude ?? null,
        longitude: location?.longitude ?? player.longitude ?? null,
        locationSource: location?.locationSource || player.locationSource || null,
        sports,
        skillLevel,
        availability: player.availability || [],
        bio: player.bio || '',
        avatar: player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username || player.name}`,
        matchesPlayed: player.matchesPlayed || 0,
        eventsJoined: player.eventsJoined || 0,
        distanceKm: player.distance_km ?? player.distanceKm ?? null,
    };
};

const normalizeCurrentUser = (user) => normalizePlayerRecord(user);

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [players, setPlayers] = useState(() => SEED_PLAYERS.map(normalizePlayerRecord));
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
                    setCurrentUser(normalizeCurrentUser(user));
                    setUseBackend(true);
                    await loadBackendData(user.id);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    api.logout();
                }
            } else {
                // Load from localStorage for demo mode
                const savedUser = localStorage.getItem('demo_user');
                if (savedUser) {
                    setCurrentUser(normalizeCurrentUser(JSON.parse(savedUser)));
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const loadBackendData = async (userId) => {
        try {
            const [playersData, eventsData] = await Promise.all([
                api.searchPlayers(),
                api.getEvents(),
            ]);
            
            setPlayers(playersData.map(normalizePlayerRecord));
            setEvents(eventsData);

            const backendMessages = await api.getMessages();
            setMessages(normalizeBackendMessages(backendMessages, userId));
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
            const normalizedUser = normalizeCurrentUser(completeUser);
            
            setCurrentUser(normalizedUser);
            setUseBackend(true);
            
            // Load backend data (players and events) after successful login
            await loadBackendData(completeUser.id);
            
            return { success: true };
        } catch (error) {
            const errorMessage = error.message || 'Invalid email or password';

            // Fallback to demo mode
            const user = SEED_PLAYERS.find(p => p.email === email && p.password === password);
            if (user) {
                const normalizedUser = normalizeCurrentUser(user);
                setCurrentUser(normalizedUser);
                localStorage.setItem('demo_user', JSON.stringify(normalizedUser));
                return { success: true };
            }
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (userData) => {
        try {
            const cityLocation = getCityLocation(userData.city);
            const normalizedEmail = userData.email.trim().toLowerCase();
            const normalizedName = userData.name.trim();
            // Try backend first
            const response = await api.register({
                username: normalizedName.toLowerCase().replace(/\s/g, ''),
                email: normalizedEmail,
                password: userData.password,
                full_name: normalizedName,
                city: userData.city,
                latitude: userData.latitude ?? cityLocation?.latitude ?? null,
                longitude: userData.longitude ?? cityLocation?.longitude ?? null,
            });

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

            const completeUser = await api.getCurrentUser();

            const normalizedUser = normalizeCurrentUser({
                ...completeUser,
                availability: userData.availability || [],
                sports: completeUser.sports?.map(s => s.sport_name) || userData.sports || [],
                skillLevel: completeUser.sports?.[0]?.skill_level || userData.skillLevel || 'Beginner',
                bio: completeUser.bio || userData.bio || '',
            });

            setCurrentUser(normalizedUser);
            setUseBackend(true);

            await loadBackendData(completeUser.id);

            return {
                success: true,
                email: response.user?.email || normalizedEmail,
                message: response.message || 'Account created successfully.',
            };
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
                const cityLocation = getCityLocation(data.city || currentUser?.city);
                // Update basic profile info
                const updated = await api.updateProfile({
                    full_name: data.name,
                    bio: data.bio,
                    city: data.city,
                    latitude: data.latitude ?? cityLocation?.latitude ?? currentUser?.latitude ?? null,
                    longitude: data.longitude ?? cityLocation?.longitude ?? currentUser?.longitude ?? null,
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
                const normalizedUser = normalizeCurrentUser({
                    ...completeUser,
                    availability: data.availability || currentUser.availability || [],
                    sports: completeUser.sports?.map(s => s.sport_name) || [],
                    skillLevel: completeUser.sports?.[0]?.skill_level || data.skillLevel || 'Beginner',
                    bio: completeUser.bio || '',
                    avatar: completeUser.avatar || currentUser.avatar,
                    matchesPlayed: currentUser.matchesPlayed || 0,
                    eventsJoined: currentUser.eventsJoined || 0,
                });
                
                setCurrentUser(normalizedUser);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const updatedPlayers = players.map(p =>
                p.id === currentUser.id ? normalizePlayerRecord({ ...p, ...data }) : p
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
        const normalizedReceiverId = Number(receiverId);

        if (useBackend) {
            try {
                await api.sendMessage(normalizedReceiverId, text);
                await loadBackendData(currentUser.id);
                
                return { success: true };
            } catch (error) {
                console.error('Send message error:', error);
                return { success: false, error: error.message };
            }
        } else {
            // Demo mode
            const senderId = currentUser.id;
            const existingThread = messages.find(
                m => (m.senderId === senderId && m.receiverId === normalizedReceiverId) ||
                    (m.senderId === normalizedReceiverId && m.receiverId === senderId)
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
                    receiverId: normalizedReceiverId,
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
        const normalizedUserId = Number(userId);
        return messages.find(
            m => (m.senderId === currentUser.id && m.receiverId === normalizedUserId) ||
                (m.senderId === normalizedUserId && m.receiverId === currentUser.id)
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
