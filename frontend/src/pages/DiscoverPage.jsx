import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SKILL_LEVELS } from '../data/seedData';
import PlayerCard from '../components/PlayerCard';
import SearchBar from '../components/SearchBar';
import SportFilter from '../components/SportFilter';
import CitySelector from '../components/CitySelector';
<<<<<<< HEAD
import NearbyMap from '../components/NearbyMap';
import { Users, SlidersHorizontal, Navigation, MapPinned } from 'lucide-react';
import { getCityLocation, getUserLocation, haversineDistanceKm } from '../utils/location';
=======
import { Users, SlidersHorizontal, MapPin } from 'lucide-react';
>>>>>>> 02de44d (Add map page, deployment config, and fixes)

export default function DiscoverPage() {
    const { players, nearbyPlayers, mapPlayers, currentUser, liveLocation, syncLocation, locationPermission } = useApp();
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
<<<<<<< HEAD
    const [addressQuery, setAddressQuery] = useState('');
    const [selectedSports, setSelectedSports] = useState([]);
    const [skillFilter, setSkillFilter] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [searchMode, setSearchMode] = useState('city');
    const [radiusKm, setRadiusKm] = useState(15);
    const [activeLocation, setActiveLocation] = useState(null);
    const [locationLabel, setLocationLabel] = useState('City mode is active');
    const [isLocating, setIsLocating] = useState(false);

    const defaultLocation = useMemo(() => getUserLocation(currentUser), [currentUser]);

    useEffect(() => {
        if (searchMode === 'gps') {
            setLocationLabel(activeLocation?.locationSource === 'live'
                ? 'Using live GPS location'
                : 'Click Refresh GPS to use your current location');
        } else if (searchMode === 'city' && city) {
            const cityLocation = getCityLocation(city);
            setActiveLocation(cityLocation || defaultLocation);
            setLocationLabel(cityLocation ? `Showing players in ${city}` : 'City mode is active');
        } else if (searchMode === 'city' && defaultLocation) {
            setActiveLocation(defaultLocation);
            setLocationLabel(
                defaultLocation.locationSource === 'city'
                    ? `Showing players near ${currentUser?.city || 'your city'}`
                    : 'City mode is active'
            );
        } else if (searchMode === 'address' && activeLocation) {
            setLocationLabel('Showing players around your entered address');
        } else {
            setActiveLocation(null);
            setLocationLabel('City mode is active');
        }
    }, [defaultLocation, currentUser?.city, city, searchMode, activeLocation]);

    const handleUseGps = () => {
        if (!navigator.geolocation) {
            setLocationLabel('GPS is not available in this browser');
            return;
        }

        setSearchMode('gps');
        setIsLocating(true);
        setLocationLabel('Requesting your live GPS location...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setActiveLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    locationSource: 'live',
                });
                setLocationLabel('Using live GPS location');
                setIsLocating(false);
            },
            (error) => {
                setLocationLabel(error.message || 'Unable to access GPS');
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleUseAddress = async () => {
        const query = addressQuery.trim();

        if (!query) {
            setLocationLabel('Enter an address to search nearby players');
            return;
        }

        setSearchMode('address');
        setIsLocating(true);
        setLocationLabel('Finding that address on the map...');

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`);
            if (!response.ok) {
                throw new Error('Unable to search that address right now');
            }

            const results = await response.json();
            if (!results.length) {
                throw new Error('No matching address found');
            }

            const matchedLocation = {
                latitude: Number(results[0].lat),
                longitude: Number(results[0].lon),
                locationSource: 'address',
            };

            setActiveLocation(matchedLocation);
            setLocationLabel(results[0].display_name || query);
        } catch (error) {
            setActiveLocation(null);
            setLocationLabel(error.message || 'Unable to search address');
        } finally {
            setIsLocating(false);
        }
    };
=======
    const [locationMode, setLocationMode] = useState('city');
    const [selectedSports, setSelectedSports] = useState([]);
    const [skillFilter, setSkillFilter] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [syncing, setSyncing] = useState(false);
    
    const visiblePlayers = locationMode === 'nearby' ? (nearbyPlayers || []) : players;
>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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

    const playersWithDistance = useMemo(() => {
        return players.map((player) => {
            const playerLocation = getUserLocation(player);
            const useLocationFiltering = searchMode === 'gps' || searchMode === 'address';
            const distanceKm = useLocationFiltering && activeLocation && playerLocation
                ? haversineDistanceKm(activeLocation, playerLocation)
                : null;

            return {
                ...player,
                location: playerLocation,
                distanceKm,
            };
        });
    }, [players, activeLocation, searchMode]);

    // Filter players
    const filtered = useMemo(() => {
<<<<<<< HEAD
        return playersWithDistance.filter(p => {
=======
        return visiblePlayers.filter(p => {
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
            if (currentUser && p.id === currentUser.id) return false;
            if (city && p.city !== city) return false;
            if (selectedSports.length > 0 && !selectedSports.some(s => p.sports.includes(s))) return false;
            if (skillFilter && p.skillLevel !== skillFilter) return false;
            if (search) {
                const q = search.toLowerCase();
                const matchesSearch =
                    p.name.toLowerCase().includes(q) ||
                    p.city.toLowerCase().includes(q) ||
                    p.bio.toLowerCase().includes(q);

                if (!matchesSearch) {
                    return false;
                }
            }
            if ((searchMode === 'gps' || searchMode === 'address') && activeLocation && Number.isFinite(p.distanceKm) && p.distanceKm > radiusKm) {
                return false;
            }
            return true;
        }).sort((left, right) => {
            if ((searchMode === 'gps' || searchMode === 'address') && activeLocation && Number.isFinite(left.distanceKm) && Number.isFinite(right.distanceKm)) {
                return left.distanceKm - right.distanceKm;
            }

            return left.name.localeCompare(right.name);
        });
<<<<<<< HEAD
    }, [playersWithDistance, currentUser, city, selectedSports, skillFilter, search, activeLocation, radiusKm, searchMode]);
=======
    }, [visiblePlayers, currentUser, city, selectedSports, skillFilter, search]);
>>>>>>> 02de44d (Add map page, deployment config, and fixes)

    const clearFilters = () => {
        setCity('');
        setLocationMode('city');
        setSelectedSports([]);
        setSkillFilter('');
        setSearch('');
        setRadiusKm(15);
    };

<<<<<<< HEAD
    const hasFilters = city || selectedSports.length > 0 || skillFilter || search || radiusKm !== 15 || searchMode !== 'city' || addressQuery;
=======
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
>>>>>>> 02de44d (Add map page, deployment config, and fixes)

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-title mb-2">
                        Nearby <span className="gradient-text">Players</span>
                    </h1>
                    <p className="section-subtitle">
                        Find sports partners by city or live GPS. Filter by sport, skill, and proximity.
                    </p>
                </div>

                <div className="card mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="text-sm font-medium text-white">Search mode</div>
                        <div className="text-xs text-dark-400 mt-1">Use city filtering for broad discovery or GPS for nearby players.</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setSearchMode('city')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${searchMode === 'city'
                                ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            <MapPinned size={14} /> City
                        </button>
                        <button
                            type="button"
                            onClick={() => setSearchMode('gps')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${searchMode === 'gps'
                                ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            <Navigation size={14} /> GPS
                        </button>
                        <button
                            type="button"
                            onClick={() => setSearchMode('address')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${searchMode === 'address'
                                ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                            }`}
                        >
                            <MapPinned size={14} /> Address
                        </button>
                    </div>
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
<<<<<<< HEAD
                            {searchMode === 'address' && (
                                <div className="glass rounded-2xl p-4 space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-white">Manual address search</div>
                                        <div className="text-xs text-dark-400 mt-1">Type any street, landmark, or area. We’ll center the map there and find nearby players.</div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={addressQuery}
                                            onChange={(event) => setAddressQuery(event.target.value)}
                                            placeholder="Enter an address, area, or landmark..."
                                            className="input-field flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUseAddress}
                                            className="btn-primary inline-flex items-center justify-center gap-2 md:w-44"
                                        >
                                            <MapPinned size={16} /> Find area
                                        </button>
                                    </div>
                                </div>
                            )}
=======
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
>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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

                            {/* Radius */}
                            <div className={`glass rounded-2xl p-4 space-y-3 ${searchMode === 'city' ? 'opacity-70' : ''}`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-white">Nearby radius</div>
                                        <div className="text-xs text-dark-400">Only applies when GPS or address search is enabled.</div>
                                    </div>
                                    <div className="badge-city">{radiusKm} km</div>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={radiusKm}
                                    onChange={(event) => setRadiusKm(Number(event.target.value))}
                                    className="w-full accent-brand-500"
                                    disabled={searchMode === 'city'}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <NearbyMap
                        currentLocation={searchMode === 'gps' || searchMode === 'address' ? activeLocation : getCityLocation(city) || defaultLocation}
                        players={filtered}
                        radiusKm={radiusKm}
                        onUseGps={handleUseGps}
                        gpsStatus={isLocating ? 'Working...' : locationLabel}
                    />
                </div>

                {/* Results count */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Users size={16} className="text-dark-500" />
                    <span className="text-sm text-dark-400">
                        {filtered.length} player{filtered.length !== 1 ? 's' : ''} found
                        {city && ` in ${city}`}
                    </span>
                    <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20 inline-flex items-center gap-1">
                        <Navigation size={12} />
                        {searchMode === 'address' ? locationLabel : (searchMode === 'gps' ? locationLabel : (city ? `Filtered by ${city}` : locationLabel))}
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
