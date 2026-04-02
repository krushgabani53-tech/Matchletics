import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import CitySelector from '../components/CitySelector';
import SportFilter from '../components/SportFilter';
import { Plus, Calendar, SlidersHorizontal } from 'lucide-react';

export default function EventsPage() {
    const { events, currentUser } = useApp();
    const [city, setCity] = useState('');
    const [selectedSports, setSelectedSports] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    const filtered = useMemo(() => {
        return events.filter(e => {
            if (city && e.city !== city) return false;
            if (selectedSports.length > 0 && !selectedSports.includes(e.sport)) return false;
            return true;
        });
    }, [events, city, selectedSports]);

    const hasFilters = city || selectedSports.length > 0;

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="section-title mb-2">
                            Open <span className="gradient-text">Matches</span>
                        </h1>
                        <p className="section-subtitle">Join or create sports events in your city</p>
                    </div>
                    {currentUser && (
                        <Link to="/events/create" className="btn-primary flex items-center gap-2 w-fit">
                            <Plus size={16} />
                            Create Event
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="card mb-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-sm font-medium text-dark-300 hover:text-white transition-colors"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {hasFilters && <span className="px-2 py-0.5 bg-brand-500/15 text-brand-400 text-xs rounded-full">Active</span>}
                        </button>
                        {hasFilters && (
                            <button onClick={() => { setCity(''); setSelectedSports([]); }} className="text-xs text-dark-400 hover:text-brand-400">
                                Clear all
                            </button>
                        )}
                    </div>

                    {showFilters && (
                        <div className="space-y-4 animate-slide-down">
                            <CitySelector value={city} onChange={setCity} />
                            <SportFilter selected={selectedSports} onChange={setSelectedSports} />
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="flex items-center gap-2 mb-6">
                    <Calendar size={16} className="text-dark-500" />
                    <span className="text-sm text-dark-400">
                        {filtered.length} event{filtered.length !== 1 ? 's' : ''}
                        {city && ` in ${city}`}
                    </span>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="font-display text-xl font-semibold text-white mb-2">No events found</h3>
                        <p className="text-dark-400 mb-6">Be the first to create an event in this city!</p>
                        {currentUser && (
                            <Link to="/events/create" className="btn-primary inline-flex items-center gap-2">
                                <Plus size={16} /> Create Event
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
