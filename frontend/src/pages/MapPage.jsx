import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NearbyPlayersMap from '../components/NearbyPlayersMap';
import PlayerCard from '../components/PlayerCard';
import { MapPin, Users } from 'lucide-react';

export default function MapPage() {
    const { mapPlayers, nearbyPlayers, liveLocation, syncLocation, currentUser } = useApp();
    const [syncing, setSyncing] = useState(false);

    const handleSyncLocation = async () => {
        setSyncing(true);
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        syncLocation(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        alert('Unable to get your location. Please enable location services and try again.');
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        } finally {
            setSyncing(false);
        }
    };

    // Filter out current user from nearby players list
    const visibleNearbyPlayers = nearbyPlayers ? nearbyPlayers.filter(p => !currentUser || p.id !== currentUser.id) : [];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
                    <div>
                        <h1 className="section-title mb-2">
                            Nearby <span className="gradient-text">Players</span> Map
                        </h1>
                        <p className="section-subtitle">
                            See who's playing around you in real-time.
                        </p>
                    </div>

                    {!liveLocation && (
                        <button
                            onClick={handleSyncLocation}
                            disabled={syncing}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MapPin size={16} />
                            {syncing ? 'Syncing...' : 'Sync Location to see nearby players'}
                        </button>
                    )}
                </div>

                <NearbyPlayersMap liveLocation={liveLocation} players={mapPlayers || []} />

                {liveLocation && (
                    <div className="mt-12 animate-slide-up">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <Users size={18} className="text-brand-400" />
                            <h2 className="text-lg font-display font-semibold text-white">
                                {visibleNearbyPlayers.length} Player{visibleNearbyPlayers.length !== 1 ? 's' : ''} Nearby
                            </h2>
                        </div>

                        {visibleNearbyPlayers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {visibleNearbyPlayers.map(player => (
                                    <PlayerCard key={player.id} player={player} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                                <MapPin size={32} className="mx-auto text-dark-400 mb-3" />
                                <h3 className="font-medium text-white mb-1">No players nearby</h3>
                                <p className="text-sm text-dark-400">There are no players sharing their location near you right now.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
