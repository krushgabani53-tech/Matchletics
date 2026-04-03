import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, MessageSquare, Eye, Navigation } from 'lucide-react';
import { SPORTS } from '../data/seedData';

export default function PlayerCard({ player }) {
    const getSportEmoji = (sportId) => {
        const sport = SPORTS.find(s => s.id === sportId);
        return sport ? sport.emoji : '🏅';
    };

    const getSportName = (sportId) => {
        const sport = SPORTS.find(s => s.id === sportId);
        return sport ? sport.name : sportId;
    };

    const skillColor = {
        'Beginner': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        'Intermediate': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        'Advanced': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    };

    return (
        <div className="group card hover:border-brand-500/20 hover:shadow-brand-500/10">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-14 h-14 rounded-xl ring-2 ring-white/10 group-hover:ring-brand-500/30 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-500 border-2 border-dark-950"></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white group-hover:text-brand-400 transition-colors truncate">
                        {player.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-ocean-400" />
                        <span className="text-xs text-dark-400">{player.city}</span>
                        <span className="mx-1 text-dark-700">·</span>
                        <span className={`badge text-xs border ${skillColor[player.skillLevel]}`}>
                            {player.skillLevel}
                        </span>
                    </div>
                    {Number.isFinite(player.distanceKm) && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-400">
                            <Navigation size={12} />
                            <span>{player.distanceKm < 1 ? `${Math.round(player.distanceKm * 1000)} m away` : `${player.distanceKm.toFixed(player.distanceKm < 10 ? 1 : 0)} km away`}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sports */}
            <div className="flex flex-wrap gap-1.5 mt-4">
                {player.sports && player.sports.length > 0 ? (
                    player.sports.map(sportId => (
                        <span key={sportId} className="badge-sport text-xs">
                            {getSportEmoji(sportId)} {getSportName(sportId)}
                        </span>
                    ))
                ) : (
                    <span className="text-xs text-dark-500">No sports listed</span>
                )}
            </div>

            {/* Bio */}
            {player.bio && (
                <p className="text-sm text-dark-400 mt-3 line-clamp-2 leading-relaxed">
                    {player.bio}
                </p>
            )}

            {/* Availability */}
            {player.availability && player.availability.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3">
                    <Clock size={12} className="text-dark-500" />
                    <span className="text-xs text-dark-500 truncate">
                        {player.availability.slice(0, 2).join(', ')}
                        {player.availability.length > 2 && ` +${player.availability.length - 2}`}
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <Link
                    to={`/profile/${player.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-sm text-dark-300 font-medium
                     hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                    <Eye size={14} />
                    Profile
                </Link>
                <Link
                    to={`/messages/${player.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-500/10 text-sm text-brand-400 font-medium
                     hover:bg-brand-500/20 hover:text-brand-300 transition-all duration-200"
                >
                    <MessageSquare size={14} />
                    Message
                </Link>
            </div>
        </div>
    );
}
