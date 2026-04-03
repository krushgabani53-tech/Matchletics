import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Users, Trophy, Shield, Zap, ArrowRight, ChevronRight, Star, Play } from 'lucide-react';
import { SPORTS } from '../data/seedData';
import Footer from '../components/Footer';

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        const el = document.getElementById(`counter-${end}`);
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, [end]);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [started, end, duration]);

    return <span id={`counter-${end}`}>{count}{suffix}</span>;
}

export default function LandingPage() {
    const { currentUser } = useApp();

    const features = [
        {
            icon: MapPin,
            title: 'City + GPS Discovery',
            description: 'Select your city or use live GPS to instantly find players near you.',
            gradient: 'from-brand-500 to-emerald-500',
        },
        {
            icon: Trophy,
            title: 'Match by Sport & Skill',
            description: 'Filter players by sport type and skill level. Find the perfect opponent or teammate.',
            gradient: 'from-ocean-500 to-blue-500',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Use city-level visibility by default, or share live GPS only when you choose.',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Zap,
            title: 'Open Matches',
            description: 'Create or join public games in your city. Fill your team and start playing!',
            gradient: 'from-amber-500 to-orange-500',
        },
    ];

    const steps = [
        { step: '01', title: 'Choose Your City', description: 'Select from 15+ cities across India', emoji: '🏙️' },
        { step: '02', title: 'Find Players', description: 'Browse players who share your sports', emoji: '🔍' },
        { step: '03', title: 'Play Together', description: 'Message, plan, and hit the field', emoji: '🏆' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-950 to-dark-900" />
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] animate-float" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-ocean-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-1.5s' }} />

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />

                    {/* Floating sport emojis */}
                    {SPORTS.map((sport, i) => (
                        <div
                            key={sport.id}
                            className="absolute text-3xl opacity-10 animate-float select-none"
                            style={{
                                left: `${10 + (i * 12) % 80}%`,
                                top: `${15 + (i * 17) % 60}%`,
                                animationDelay: `${i * -0.8}s`,
                                animationDuration: `${5 + i * 0.5}s`,
                            }}
                        >
                            {sport.emoji}
                        </div>
                    ))}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-brand-400 mb-8 animate-fade-in">
                            <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                            <span>Join 500+ sports enthusiasts across India</span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-up">
                            Find Your
                            <span className="gradient-text block">Matchletics</span>
                            <span className="text-dark-300 text-4xl sm:text-5xl lg:text-5xl font-semibold">in Your City</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-dark-400 leading-relaxed max-w-xl mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                            Connect with sports enthusiasts nearby. Start with your city, opt into GPS when you want a tighter match radius, and get playing.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <Link
                                to={currentUser ? '/discover' : '/signup'}
                                className="btn-primary text-base flex items-center gap-2 !px-8 !py-4"
                            >
                                {currentUser ? 'Find Players' : 'Get Started Free'}
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to={currentUser ? '/events' : '/login'}
                                className="btn-secondary text-base flex items-center gap-2 !px-8 !py-4"
                            >
                                {currentUser ? 'Browse Events' : 'Log In'}
                            </Link>
                        </div>

                        {/* Quick stats */}
                        <div className="flex items-center gap-8 mt-12 animate-slide-up" style={{ animationDelay: '0.45s' }}>
                            <div>
                                <div className="text-2xl font-display font-bold text-white">15+</div>
                                <div className="text-xs text-dark-500">Cities</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <div className="text-2xl font-display font-bold text-white">8</div>
                                <div className="text-xs text-dark-500">Sports</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <div className="text-2xl font-display font-bold text-white">100%</div>
                                <div className="text-xs text-dark-500">Privacy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4">
                            Everything You Need to <span className="gradient-text">Play</span>
                        </h2>
                        <p className="section-subtitle mx-auto">
                            A better way to find teammates and organize sports in your city
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="card group p-8"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5
                                 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                                    style={{ boxShadow: `0 8px 24px rgba(0,0,0,0.2)` }}>
                                    <feature.icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4">
                            How <span className="gradient-text">Matchletics</span> Works
                        </h2>
                        <p className="section-subtitle mx-auto">
                            Three simple steps to find your next game
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center group">
                                {/* Connector line */}
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                                )}

                                <div className="w-24 h-24 mx-auto rounded-2xl glass flex items-center justify-center text-4xl mb-6
                                group-hover:bg-white/10 group-hover:scale-105 transition-all duration-300">
                                    {step.emoji}
                                </div>
                                <div className="text-xs text-brand-400 font-mono font-semibold mb-2">STEP {step.step}</div>
                                <h3 className="font-display text-xl font-semibold text-white mb-2">{step.title}</h3>
                                <p className="text-dark-400 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sports Grid */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">
                            Sports We <span className="gradient-text">Support</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {SPORTS.map((sport) => (
                            <div
                                key={sport.id}
                                className="card text-center py-8 group cursor-default"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {sport.emoji}
                                </div>
                                <h4 className="font-display font-semibold text-white text-sm">{sport.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-ocean-500/5" />
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: 500, suffix: '+', label: 'Players' },
                            { value: 15, suffix: '+', label: 'Cities' },
                            { value: 8, suffix: '', label: 'Sports' },
                            { value: 200, suffix: '+', label: 'Matches Played' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-1">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-dark-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card p-12 md:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-ocean-500/10" />
                        <div className="relative">
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                                Ready to Find Your <span className="gradient-text">Matchletics</span>?
                            </h2>
                            <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
                                Join hundreds of sports enthusiasts and start playing today. It's free, private, and community-driven.
                            </p>
                            <Link
                                to={currentUser ? '/discover' : '/signup'}
                                className="btn-primary text-lg inline-flex items-center gap-2 !px-10 !py-4"
                            >
                                {currentUser ? 'Explore Players' : 'Join Matchletics Free'}
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
