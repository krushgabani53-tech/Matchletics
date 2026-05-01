import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { SEED_PLAYERS, SEED_EVENTS, SEED_MESSAGES } from '../data/seedData';
import { getCityLocation, getUserLocation } from '../utils/location';

const AppContext = createContext(null);

<<<<<<< HEAD
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
=======
const normalizeId = (value) => String(value);

const normalizeBackendTimestamp = (timestamp) => {
    if (!timestamp) return timestamp;

    if (typeof timestamp === 'string') {
        const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(timestamp);
        return hasTimezone ? timestamp : `${timestamp}Z`;
    }

    return timestamp;
};

const normalizePlayerRecord = (player) => ({
    id: player.id,
    name: player.full_name || player.username,
    email: player.email,
    username: player.username,
    city: player.city || '',
    sports: player.sports?.map(s => s.sport_name) || [],
    skillLevel: player.sports?.[0]?.skill_level || 'Beginner',
    availability: [],
    bio: player.bio || '',
    avatar: player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
    matchesPlayed: 0,
    eventsJoined: 0,
    distanceKm: player.distance_km ?? null,
    latitude: typeof player.latitude === 'number' ? player.latitude : null,
    longitude: typeof player.longitude === 'number' ? player.longitude : null,
    primarySport: player.primary_sport || player.sports?.[0]?.sport_name || null,
    locationSharingEnabled: player.location_sharing_enabled ?? true,
});

const isSameConversation = (thread, userA, userB) => {
    const threadSenderId = normalizeId(thread.senderId);
    const threadReceiverId = normalizeId(thread.receiverId);
    const normalizedUserA = normalizeId(userA);
    const normalizedUserB = normalizeId(userB);

    return (
        (threadSenderId === normalizedUserA && threadReceiverId === normalizedUserB) ||
        (threadSenderId === normalizedUserB && threadReceiverId === normalizedUserA)
    );
};

const normalizeBackendMessages = (messagesData) => {
    const sortedMessages = [...messagesData].sort(
        (left, right) => new Date(left.created_at) - new Date(right.created_at)
    );

    const threadsByUsers = new Map();

    sortedMessages.forEach((message) => {
        const senderId = message.sender_id;
        const receiverId = message.receiver_id;
        const threadKey = [normalizeId(senderId), normalizeId(receiverId)].sort().join('-');

        if (!threadsByUsers.has(threadKey)) {
            threadsByUsers.set(threadKey, {
                id: `thread-${threadKey}`,
                senderId,
                receiverId,
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
                messages: [],
            });
        }

<<<<<<< HEAD
        const thread = threadMap.get(threadId);
        thread.messages.push({
            id: message.id,
            from: senderId,
            text: message.content,
            timestamp: message.created_at,
=======
        threadsByUsers.get(threadKey).messages.push({
            id: message.id,
            from: senderId,
            text: message.content,
            timestamp: normalizeBackendTimestamp(message.created_at),
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
            isRead: message.is_read,
        });
    });

<<<<<<< HEAD
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
=======
    return Array.from(threadsByUsers.values()).sort((left, right) => {
        const leftTime = left.messages[left.messages.length - 1]?.timestamp || 0;
        const rightTime = right.messages[right.messages.length - 1]?.timestamp || 0;
        return new Date(rightTime) - new Date(leftTime);
    });
};

export function AppProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [players, setPlayers] = useState(SEED_PLAYERS);
    const [nearbyPlayers, setNearbyPlayers] = useState(null);
    const [mapPlayers, setMapPlayers] = useState([]);
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
    const [events, setEvents] = useState(SEED_EVENTS);
    const [messages, setMessages] = useState(SEED_MESSAGES);
    const [loading, setLoading] = useState(true);
    const [useBackend, setUseBackend] = useState(false);
    const [liveLocation, setLiveLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt');
    const geolocationWatchRef = useRef(null);
    const locationSyncTimeoutRef = useRef(null);
    const lastLocationSyncRef = useRef(0);
    const liveLocationRef = useRef(null);

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
            
<<<<<<< HEAD
            setPlayers(playersData.map(normalizePlayerRecord));
            setEvents(eventsData);

            const backendMessages = await api.getMessages();
            setMessages(normalizeBackendMessages(backendMessages, userId));
=======
            const normalizedPlayers = playersData.map(normalizePlayerRecord);
            
            setPlayers(normalizedPlayers);
            setEvents(eventsData);

            await loadBackendMessages();
            await loadMapPlayers();
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
        } catch (error) {
            console.error('Failed to load backend data:', error);
        }
    };

    const loadBackendMessages = async () => {
        try {
            const backendMessages = await api.getMessages();
            setMessages(normalizeBackendMessages(backendMessages));
        } catch (error) {
            console.error('Failed to load backend messages:', error);
            setMessages([]);
        }
    };

    const loadNearbyPlayers = async (latitude, longitude) => {
        try {
            const nearbyData = await api.getNearbyPlayers({
                latitude,
                longitude,
                radius: 100,
            });

            setNearbyPlayers(nearbyData.map(normalizePlayerRecord));
        } catch (error) {
            console.error('Failed to load nearby players:', error);
            setNearbyPlayers(null);
        }
    };

    const loadMapPlayers = async (latitude, longitude) => {
        try {
            const params = {};
            if (typeof latitude === 'number' && typeof longitude === 'number') {
                params.latitude = latitude;
                params.longitude = longitude;
            }

            const mapData = await api.getMapPlayers(params);
            setMapPlayers(mapData.map(normalizePlayerRecord));
        } catch (error) {
            console.error('Failed to load map players:', error);
            setMapPlayers([]);
        }
    };

    const syncLocation = async (latitude, longitude) => {
        if (!currentUser || currentUser.location_sharing_enabled === false) return;

        const now = Date.now();
        if (now - lastLocationSyncRef.current < 10000) return;
        lastLocationSyncRef.current = now;

        try {
            await api.updateUserLocation(latitude, longitude, true);
            const latestLocation = { latitude, longitude, updatedAt: new Date().toISOString() };
            liveLocationRef.current = latestLocation;
            setLiveLocation(latestLocation);
            await loadNearbyPlayers(latitude, longitude);
            await loadMapPlayers(latitude, longitude);
        } catch (error) {
            console.error('Failed to sync user location:', error);
        }
    };

    const login = async (email, password) => {
        try {
            // Try backend first - send email directly (backend accepts email or username)
            const response = await api.login(email, password);
            
            // Fetch complete user data with sports
            const completeUser = await api.getCurrentUser();
            
            // Normalize user data to match frontend expectations
<<<<<<< HEAD
            const normalizedUser = normalizeCurrentUser(completeUser);
=======
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
                location_sharing_enabled: completeUser.location_sharing_enabled ?? true,
            };
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
            
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
<<<<<<< HEAD
            });

=======
                avatar: completeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${completeUser.username}`,
                matchesPlayed: 0,
                eventsJoined: 0,
                location_sharing_enabled: completeUser.location_sharing_enabled ?? true,
            };
            
            // Set user and backend mode
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
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
        setNearbyPlayers(null);
        setMapPlayers([]);
        setLiveLocation(null);
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
<<<<<<< HEAD
                await api.sendMessage(normalizedReceiverId, text);
                await loadBackendData(currentUser.id);
                
=======
                await api.sendMessage(receiverId, text);

                await loadBackendMessages();

>>>>>>> 02de44d (Add map page, deployment config, and fixes)
                return { success: true };
            } catch (error) {
                console.error('Send message error:', error);
                return { success: false, error: error.message };
            }
<<<<<<< HEAD
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
=======
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
        }

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
    };

    useEffect(() => {
        if (!useBackend || !currentUser) {
            if (geolocationWatchRef.current !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(geolocationWatchRef.current);
                geolocationWatchRef.current = null;
            }

            if (locationSyncTimeoutRef.current) {
                clearTimeout(locationSyncTimeoutRef.current);
                locationSyncTimeoutRef.current = null;
            }

            return;
        }

        if (!navigator.geolocation) {
            setLocationPermission('unsupported');
            loadMapPlayers();
            return;
        }

        const startWatchingLocation = async () => {
            try {
                const permissionStatus = await navigator.permissions?.query({ name: 'geolocation' });
                if (permissionStatus?.state) {
                    setLocationPermission(permissionStatus.state);
                }

                geolocationWatchRef.current = navigator.geolocation.watchPosition(
                    (position) => {
                        setLocationPermission('granted');
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        liveLocationRef.current = { latitude, longitude, updatedAt: new Date().toISOString() };
                        setLiveLocation(liveLocationRef.current);

                        if (locationSyncTimeoutRef.current) {
                            clearTimeout(locationSyncTimeoutRef.current);
                        }

                        locationSyncTimeoutRef.current = setTimeout(() => {
                            syncLocation(latitude, longitude);
                        }, 1000);
                    },
                    (error) => {
                        if (error.code === error.PERMISSION_DENIED) {
                            setLocationPermission('denied');
                        } else {
                            setLocationPermission('error');
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 10000,
                    }
                );
            } catch (error) {
                console.error('Unable to start geolocation watch:', error);
                setLocationPermission('error');
            }
        };

        startWatchingLocation();

        const refreshNearbyInterval = setInterval(() => {
            if (liveLocationRef.current?.latitude != null && liveLocationRef.current?.longitude != null && currentUser.location_sharing_enabled !== false) {
                loadNearbyPlayers(liveLocationRef.current.latitude, liveLocationRef.current.longitude);
                loadMapPlayers(liveLocationRef.current.latitude, liveLocationRef.current.longitude);
            }
        }, 15000);

        return () => {
            if (geolocationWatchRef.current !== null) {
                navigator.geolocation.clearWatch(geolocationWatchRef.current);
                geolocationWatchRef.current = null;
            }

            if (locationSyncTimeoutRef.current) {
                clearTimeout(locationSyncTimeoutRef.current);
                locationSyncTimeoutRef.current = null;
            }

            clearInterval(refreshNearbyInterval);
        };
    }, [useBackend, currentUser?.id, currentUser?.location_sharing_enabled]);

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
<<<<<<< HEAD
            m => (m.senderId === currentUser.id && m.receiverId === normalizedUserId) ||
                (m.senderId === normalizedUserId && m.receiverId === currentUser.id)
=======
            m => isSameConversation(m, currentUser.id, userId)
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
        );
    };

    const getUserThreads = () => {
        if (!currentUser) return [];
        return messages.filter(
            m => normalizeId(m.senderId) === normalizeId(currentUser.id) || normalizeId(m.receiverId) === normalizeId(currentUser.id)
        );
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            players,
            nearbyPlayers,
            mapPlayers,
            events,
            messages,
            loading,
            useBackend,
            liveLocation,
            locationPermission,
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
            syncLocation,
            loadMapPlayers,
            loadNearbyPlayers,
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
