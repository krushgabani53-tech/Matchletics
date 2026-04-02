import { useApp } from '../context/AppContext';
import { SPORTS } from '../data/seedData';
import { MapPin, Calendar, Clock, Users, UserPlus, UserMinus } from 'lucide-react';

export default function EventCard({ event }) {
    const { currentUser, joinEvent, leaveEvent, getPlayerById } = useApp();

    const sport = SPORTS.find(s => s.id === event.sport);
    const organizer = getPlayerById(event.organizerId || event.organizer_id);
    
    // Normalize IDs for comparison (handle both string and number IDs)
    const currentUserId = currentUser?.id;
    const eventParticipants = event.participants || [];
    const eventOrganizerId = event.organizerId || event.organizer_id;
    
    const isJoined = currentUser && eventParticipants.some(pid => 
        pid == currentUserId || parseInt(pid) === parseInt(currentUserId)
    );
    const isOrganizer = currentUser && (eventOrganizerId == currentUserId || parseInt(eventOrganizerId) === parseInt(currentUserId));
    const isFull = eventParticipants.length >= event.maxPlayers || eventParticipants.length >= event.max_players;
    const maxPlayers = event.maxPlayers || event.max_players || 10;
    const spotsLeft = maxPlayers - eventParticipants.length;
    const fillPercent = (eventParticipants.length / maxPlayers) * 100;

    const handleToggle = () => {
        if (isJoined && !isOrganizer) {
            leaveEvent(event.id);
        } else if (!isJoined && !isFull) {
            joinEvent(event.id);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    return (
        <div className="card group hover:border-brand-500/20">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-ocean-500/20 flex items-center justify-center text-xl">
                        {sport?.emoji || '🏅'}
                    </div>
                    <div>
                        <h3 className="font-display font-semibold text-white group-hover:text-brand-400 transition-colors">
                            {event.title}
                        </h3>
                        <span className="badge-sport text-xs mt-1">{sport?.name || event.sport}</span>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    <MapPin size={14} className="text-ocean-400" />
                    {event.city}
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Calendar size={14} className="text-brand-400" />
                    {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                    <Clock size={14} className="text-purple-400" />
                    {event.time}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-dark-400 mt-3 line-clamp-2">{event.description}</p>

            {/* Organizer */}
            {organizer && (
                <div className="flex items-center gap-2 mt-3 text-xs text-dark-500">
                    <img src={organizer.avatar} alt={organizer.name} className="w-5 h-5 rounded-full" />
                    Organized by {organizer.name}
                </div>
            )}

            {/* Spots Progress */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-dark-400 flex items-center gap-1">
                        <Users size={12} />
                        {eventParticipants.length}/{maxPlayers} players
                    </span>
                    <span className={`font-medium ${spotsLeft <= 2 ? 'text-amber-400' : 'text-brand-400'}`}>
                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                    </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : fillPercent > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-ocean-500'
                            }`}
                        style={{ width: `${fillPercent}%` }}
                    />
                </div>
            </div>

            {/* Action */}
            {currentUser && (
                <button
                    onClick={handleToggle}
                    disabled={isOrganizer || (isFull && !isJoined)}
                    className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isOrganizer
                            ? 'bg-white/5 text-dark-500 cursor-default'
                            : isJoined
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                : isFull
                                    ? 'bg-white/5 text-dark-500 cursor-not-allowed'
                                    : 'bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 border border-brand-500/20'
                        }`}
                >
                    {isOrganizer ? (
                        <>You're the organizer</>
                    ) : isJoined ? (
                        <><UserMinus size={14} /> Leave Event</>
                    ) : isFull ? (
                        <>Event Full</>
                    ) : (
                        <><UserPlus size={14} /> Join Event</>
                    )}
                </button>
            )}
        </div>
    );
}
