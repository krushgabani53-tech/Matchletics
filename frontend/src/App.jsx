import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import MessagesPage from './pages/MessagesPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import MapPage from './pages/MapPage';

export default function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="min-h-screen bg-dark-950">
            {!isAuthPage && <Navbar />}
            <Routes key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/discover" element={<ProtectedRoute><DiscoverPage /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                <Route path="/messages/:userId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
                <Route path="/events/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}
