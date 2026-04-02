import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SPORTS } from '../data/seedData';
import { MapPin, Clock, Trophy, Calendar, MessageSquare, ArrowLeft, Star, Edit } from 'lucide-react';

export default function ProfilePage() {
    const { id } = useParams();
    const { getPlayerById, currentUser } = useApp();
    const navigate = useNavigate();
    const player = getPlayerById(id);

    if (!player) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="font-display text-2xl font-bold text-white mb-2">Player not found</h2>
                    <Link to="/discover" className="btn-primary mt-4 inline-block">Back to Discover</Link>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser && currentUser.id === player.id;

    const getSportInfo = (sportId) => SPORTS.find(s => s.id === sportId);

    const skillColor = {
        'Beginner': 'from-emerald-500 to-green-500',
        'Intermediate': 'from-amber-500 to-orange-500',
        'Advanced': 'from-purple-500 to-pink-500',
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                {/* Profile Card */}
                <div className="card p-0 overflow-hidden">
                    {/* Banner */}
                    <div className="h-32 sm:h-40 bg-gradient-to-r from-brand-500/20 via-ocean-500/10 to-purple-500/20 relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(9,220,94,0.15),transparent)]" />
                    </div>

                    {/* Avatar & Name */}
                    <div className="px-6 sm:px-8 -mt-12 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-24 h-24 rounded-2xl ring-4 ring-dark-950 shadow-xl"
                            />
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{player.name}</h1>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-sm text-dark-400">
                                                <MapPin size={14} className="text-ocean-400" />
                                                {player.city}
                                            </span>
                                            <span className={`badge text-xs bg-gradient-to-r ${skillColor[player.skillLevel]} text-white`}>
                                                {player.skillLevel}
                                            </span>
                                        </div>
                                    </div>
                                    {isOwnProfile ? (
                                        <Link to="/profile/edit" className="btn-secondary text-sm flex items-center gap-2 !px-4 !py-2">
                                            <Edit size={14} /> Edit Profile
                                        </Link>
                                    ) : (
                                        <Link to={`/messages/${player.id}`} className="btn-primary text-sm flex items-center gap-2 !px-5 !py-2.5">
                                            <MessageSquare size={14} /> Message
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {player.bio && (
                            <p className="text-dark-300 mt-6 leading-relaxed">{player.bio}</p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="font-display text-2xl font-bold text-white">{player.matchesPlayed || 0}</div>
                                <div className="text-xs text-dark-400 mt-1">Matches Played</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="font-display text-2xl font-bold text-white">{player.eventsJoined || 0}</div>
                                <div className="text-xs text-dark-400 mt-1">Events Joined</div>
                            </div>
                            <div className="glass rounded-xl p-4 text-center">
                                <div className="font-display text-2xl font-bold text-white">{player.sports?.length || 0}</div>
                                <div className="text-xs text-dark-400 mt-1">Sports</div>
                            </div>
                        </div>

                        {/* Sports */}
                        {player.sports && player.sports.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                                    <Trophy size={16} className="text-brand-400" />
                                    Sports
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {player.sports.map(sportId => {
                                        const sport = getSportInfo(sportId);
                                        return (
                                            <span key={sportId} className="badge-sport text-sm px-4 py-2">
                                                {sport?.emoji} {sport?.name || sportId}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Availability */}
                        {player.availability && player.availability.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-ocean-400" />
                                    Availability
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {player.availability.map(avail => (
                                        <span key={avail} className="badge-city text-sm px-4 py-2">
                                            {avail}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
