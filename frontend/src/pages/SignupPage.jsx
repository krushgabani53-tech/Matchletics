import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIES, SPORTS, SKILL_LEVELS, AVAILABILITY_OPTIONS } from '../data/seedData';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, MapPin, Check } from 'lucide-react';

export default function SignupPage() {
    const { signup } = useApp();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        city: '',
        sports: [],
        skillLevel: 'Beginner',
        availability: [],
        bio: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const toggleSport = (sportId) => {
        setForm(prev => ({
            ...prev,
            sports: prev.sports.includes(sportId)
                ? prev.sports.filter(s => s !== sportId)
                : [...prev.sports, sportId]
        }));
    };

    const toggleAvailability = (avail) => {
        setForm(prev => ({
            ...prev,
            availability: prev.availability.includes(avail)
                ? prev.availability.filter(a => a !== avail)
                : [...prev.availability, avail]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            if (!form.name || !form.email || !form.password) {
                setError('Please fill in all fields');
                return;
            }

            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            setError('');
            setStep(2);
            return;
        }

        if (step === 2) {
            if (!form.city) {
                setError('Please select a city');
                return;
            }
            if (form.sports.length === 0) {
                setError('Please select at least one sport');
                return;
            }
            setError('');
            setStep(3);
            return;
        }

        // Step 3 — submit
        setError('');
        setLoading(true);

        try {
            const result = await signup(form);
            if (result.success) {
                // Use replace to avoid back button issues and ensure clean navigation
                setTimeout(() => {
                    navigate('/discover', { replace: true });
                }, 150);
            } else {
                setError(result.error || 'Registration failed. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Signup error:', err);
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex">
            {/* Left — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center">
                            <span className="text-white font-display font-bold text-lg">P</span>
                        </div>
                        <span className="font-display font-bold text-xl text-white">
                            Match<span className="text-brand-400">letics</span>
                        </span>
                    </Link>

                    <h1 className="font-display text-3xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-dark-400 mb-6">Step {step} of 3 — {step === 1 ? 'Your details' : step === 2 ? 'Sports & City' : 'Almost done!'}</p>

                    {/* Progress bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-brand-500' : 'bg-white/10'
                                }`} />
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Arjun Mehta"
                                            className="input-field pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => {
                                                const email = e.target.value;
                                                setForm({ ...form, email });
                                                if (error) {
                                                    setError('');
                                                }
                                            }}
                                            placeholder="you@example.com"
                                            className="input-field pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            placeholder="Min 6 characters"
                                            className="input-field pl-10 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-3">
                                        <MapPin size={16} className="inline mr-2 text-ocean-400" />
                                        Select Your City
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CITIES.map(city => (
                                            <button
                                                key={city}
                                                type="button"
                                                onClick={() => setForm({ ...form, city })}
                                                className={`relative px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                                                    form.city === city
                                                        ? 'bg-ocean-500/15 text-ocean-400 border-ocean-500/30 shadow-lg shadow-ocean-500/10'
                                                        : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                            >
                                                <span className="block">{city}</span>
                                                {form.city === city && (
                                                    <Check size={14} className="absolute top-2 right-2 text-ocean-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-3">Select Sports</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SPORTS.map(sport => (
                                            <button
                                                key={sport.id}
                                                type="button"
                                                onClick={() => toggleSport(sport.id)}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${form.sports.includes(sport.id)
                                                        ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                                        : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span>{sport.emoji}</span>
                                                <span>{sport.name}</span>
                                                {form.sports.includes(sport.id) && <Check size={14} className="ml-auto" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Skill Level</label>
                                    <div className="flex gap-2">
                                        {SKILL_LEVELS.map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setForm({ ...form, skillLevel: level })}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.skillLevel === level
                                                        ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                                        : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-3">Availability</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {AVAILABILITY_OPTIONS.map(avail => (
                                            <button
                                                key={avail}
                                                type="button"
                                                onClick={() => toggleAvailability(avail)}
                                                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${form.availability.includes(avail)
                                                        ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                                        : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {avail}
                                                {form.availability.includes(avail) && ' ✓'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-dark-300 mb-2">Bio <span className="text-dark-500">(optional)</span></label>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        placeholder="Tell others about yourself and your sports interests..."
                                        className="input-field resize-none h-24"
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-dark-500 mt-1">{form.bio.length}/200</p>
                                </div>
                            </>
                        )}

                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => { setStep(step - 1); setError(''); }}
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : step < 3 ? (
                                    <>Next <ArrowRight size={16} /></>
                                ) : (
                                    <>Create Account <ArrowRight size={16} /></>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-dark-400 text-sm mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right — Visual */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-500/20 via-dark-950 to-brand-500/20" />
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-ocean-500/15 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-brand-500/15 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-2s' }} />

                <div className="relative text-center max-w-sm px-6">
                    <div className="text-7xl mb-6 animate-float">🏆</div>
                    <h2 className="font-display text-3xl font-bold text-white mb-3">
                        Join the <span className="gradient-text">Community</span>
                    </h2>
                    <p className="text-dark-400 leading-relaxed">
                        Connect with sports lovers in your city. Create your profile, find partners, and never miss a game.
                    </p>

                    <div className="mt-8 space-y-3">
                        {['City-based matching', 'Optional GPS nearby view', 'Open match system'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3 animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                <Check size={16} className="text-brand-400" />
                                <span className="text-sm text-dark-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
