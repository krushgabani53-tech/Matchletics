import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Search, MessageSquare, Calendar, Compass, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout } = useApp();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = currentUser ? [
        { path: '/discover', label: 'Discover', icon: Compass },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
    ] : [];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-brand-500/30 transition-all duration-300">
                            <span className="text-white font-display font-bold text-lg">P</span>
                        </div>
                        <span className="font-display font-bold text-xl text-white group-hover:text-brand-400 transition-colors">
                            Match<span className="text-brand-400 group-hover:text-brand-300">letics</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(path)
                                    ? 'bg-brand-500/15 text-brand-400 shadow-sm'
                                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                                >
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        className="w-8 h-8 rounded-full ring-2 ring-brand-500/30"
                                    />
                                    <span className="text-sm font-medium text-white max-w-[120px] truncate">{currentUser.name}</span>
                                    <ChevronDown size={14} className={`text-dark-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 glass rounded-xl py-2 shadow-2xl shadow-black/40 animate-slide-down">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-sm font-medium text-white">{currentUser.name}</p>
                                            <p className="text-xs text-dark-400 truncate">{currentUser.email}</p>
                                        </div>
                                        <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <User size={16} />
                                            View Profile
                                        </Link>
                                        <Link to="/profile/edit" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-white/5 transition-colors">
                                            <User size={16} />
                                            Edit Profile
                                        </Link>
                                        <hr className="my-1 border-white/10" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn-ghost text-sm">Log In</Link>
                                <Link to="/signup" className="btn-primary text-sm !px-5 !py-2.5">Sign Up Free</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-dark-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-dark-950/95 backdrop-blur-2xl border-t border-white/10 animate-slide-down">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map(({ path, label, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(path) ? 'bg-brand-500/15 text-brand-400' : 'text-dark-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        ))}
                        {currentUser ? (
                            <>
                                <hr className="border-white/10 my-2" />
                                <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-dark-300 hover:text-white hover:bg-white/5">
                                    <User size={18} />
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/5">
                                    <LogOut size={18} />
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <hr className="border-white/10 my-2" />
                                <Link to="/login" className="block px-4 py-3 text-sm text-dark-300 hover:text-white">Log In</Link>
                                <Link to="/signup" className="block px-4 py-3 text-sm text-brand-400 font-medium">Sign Up Free</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
