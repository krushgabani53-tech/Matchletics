import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SKILL_LEVELS } from '../data/seedData';
import PlayerCard from '../components/PlayerCard';
import SearchBar from '../components/SearchBar';
import SportFilter from '../components/SportFilter';
import CitySelector from '../components/CitySelector';
import { Users, SlidersHorizontal, MapPin } from 'lucide-react';

export default function DiscoverPage() {
    const { players, nearbyPlayers, mapPlayers, currentUser, liveLocation, syncLocation, locationPermission } = useApp();
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [locationMode, setLocationMode] = useState('city');
    const [selectedSports, setSelectedSports] = useState([]);
    const [skillFilter, setSkillFilter] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [syncing, setSyncing] = useState(false);
    
    const visiblePlayers = locationMode === 'nearby' ? (nearbyPlayers || []) : players;

    // Player counts per city
    const playerCounts = useMemo(() => {
        const counts = {};
        visiblePlayers.forEach(p => {
            if (p.id !== currentUser?.id) {
                counts[p.city] = (counts[p.city] || 0) + 1;
            }
        });
        return counts;
    }, [visiblePlayers, currentUser]);

    // Filter players
    const filtered = useMemo(() => {
        return visiblePlayers.filter(p => {
            if (currentUser && p.id === currentUser.id) return false;
            if (city && p.city !== city) return false;
            if (selectedSports.length > 0 && !selectedSports.some(s => p.sports.includes(s))) return false;
            if (skillFilter && p.skillLevel !== skillFilter) return false;
            if (search) {
                const q = search.toLowerCase();
                return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q);
            }
            return true;
        });
    }, [visiblePlayers, currentUser, city, selectedSports, skillFilter, search]);

    const clearFilters = () => {
        setCity('');
        setLocationMode('city');
        setSelectedSports([]);
        setSkillFilter('');
        setSearch('');
    };

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

    const hasFilters = city || selectedSports.length > 0 || skillFilter || search || locationMode === 'nearby';

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-title mb-2">
                        Discover <span className="gradient-text">Players</span>
                    </h1>
                    <p className="section-subtitle">
                        Find sports partners in your city. Filter by sport, skill, and more.
                    </p>
                </div>

                {/* Filters */}
                <div className="card mb-8 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm font-medium text-dark-300 hover:text-white transition-colors"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {hasFilters && (
                                <span className="px-2 py-0.5 bg-brand-500/15 text-brand-400 text-xs rounded-full">Active</span>
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            {hasFilters && (
                                <button onClick={clearFilters} className="text-xs text-dark-400 hover:text-brand-400 transition-colors">
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="space-y-4 animate-slide-down">
                            {/* Location Mode */}
                            <div className="flex bg-white/5 p-1 rounded-xl w-fit">
                                <button
                                    onClick={() => setLocationMode('city')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${locationMode === 'city' ? 'bg-brand-500 text-white shadow-md' : 'text-dark-400 hover:text-white'}`}
                                >
                                    By City
                                </button>
                                <button
                                    onClick={() => {
                                        setLocationMode('nearby');
                                        if (!liveLocation) handleSyncLocation();
                                    }}
                                    disabled={syncing}
                                    className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 ${locationMode === 'nearby' ? 'bg-green-500 text-white shadow-md' : 'text-dark-400 hover:text-white'}`}
                                >
                                    <MapPin size={14} />
                                    {syncing ? 'Syncing...' : 'Nearby'}
                                </button>
                            </div>

                            {/* Search + City */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SearchBar value={search} onChange={setSearch} placeholder="Search by name, city, or bio..." />
                                {locationMode === 'city' && (
                                    <CitySelector value={city} onChange={setCity} playerCounts={playerCounts} />
                                )}
                            </div>

                            {/* Sports */}
                            <SportFilter selected={selectedSports} onChange={setSelectedSports} />

                            {/* Skill Level */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSkillFilter('')}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${!skillFilter ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    All Levels
                                </button>
                                {SKILL_LEVELS.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setSkillFilter(skillFilter === level ? '' : level)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${skillFilter === level ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results count */}
                <div className="flex items-center gap-2 mb-6">
                    <Users size={16} className="text-dark-500" />
                    <span className="text-sm text-dark-400">
                        {filtered.length} player{filtered.length !== 1 ? 's' : ''} found
                        {city && ` in ${city}`}
                    </span>
                </div>

                {/* Player Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(player => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="font-display text-xl font-semibold text-white mb-2">No players found</h3>
                        <p className="text-dark-400 mb-6">Try adjusting your filters or search terms</p>
                        <button onClick={clearFilters} className="btn-primary">Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
