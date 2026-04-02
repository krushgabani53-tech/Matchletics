import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center">
                                <span className="text-white font-display font-bold">P</span>
                            </div>
                            <span className="font-display font-bold text-lg text-white">
                                Play<span className="text-brand-400">Mate</span>
                            </span>
                        </Link>
                        <p className="text-sm text-dark-400 leading-relaxed">
                            Find sports partners in your city. No GPS tracking — just community-driven player discovery.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/discover" className="text-sm text-dark-400 hover:text-brand-400 transition-colors">Discover Players</Link></li>
                            <li><Link to="/events" className="text-sm text-dark-400 hover:text-brand-400 transition-colors">Open Matches</Link></li>
                            <li><Link to="/signup" className="text-sm text-dark-400 hover:text-brand-400 transition-colors">Join Matchletics</Link></li>
                        </ul>
                    </div>

                    {/* Sports */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4">Sports</h4>
                        <ul className="space-y-2.5">
                            <li className="text-sm text-dark-400">⚽ Football</li>
                            <li className="text-sm text-dark-400">🏏 Cricket</li>
                            <li className="text-sm text-dark-400">🏸 Badminton</li>
                            <li className="text-sm text-dark-400">🏀 Basketball</li>
                            <li className="text-sm text-dark-400">🎾 Tennis</li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-4">Connect</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                                <Instagram size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:text-brand-400 hover:border-brand-500/30 transition-all">
                                <Github size={16} />
                            </a>
                        </div>
                        <p className="text-sm text-dark-400 mt-4">
                            support@matchletics.app
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-dark-500">
                        © 2026 Matchletics. All rights reserved.
                    </p>
                    <p className="text-xs text-dark-500 flex items-center gap-1">
                        Made with <Heart size={12} className="text-red-400 fill-red-400" /> for sports lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
