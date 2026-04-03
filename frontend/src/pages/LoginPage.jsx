import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap } from 'lucide-react';

export default function LoginPage() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(form.email, form.password);
            if (result.success) {
                // Use replace to avoid back button issues and ensure clean navigation
                setTimeout(() => {
                    navigate('/discover', { replace: true });
                }, 150);
            } else {
                setError(result.error || 'Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error('Login error:', err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-500 flex items-center justify-center">
                            <span className="text-white font-display font-bold text-lg">P</span>
                        </div>
                        <span className="font-display font-bold text-xl text-white">
                            Match<span className="text-brand-400">letics</span>
                        </span>
                    </Link>

                    <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-dark-400 mb-8">Log in to find your sports partners</p>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-scale-in">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                                    placeholder="Enter your password"
                                    className="input-field pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Log In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-dark-400 text-sm mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                            Sign up free
                        </Link>
                    </p>

                    {/* Demo credentials */}
                    <div className="mt-8 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
                        <div className="flex items-center gap-2 text-xs font-medium text-brand-400 mb-2">
                            <Zap size={12} />
                            Demo Credentials
                        </div>
                        <p className="text-xs text-dark-400">
                            Email: <code className="text-brand-300">arjun@playmate.app</code><br />
                            Password: <code className="text-brand-300">demo123</code>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right — Visual */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-dark-950 to-ocean-500/20" />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-ocean-500/20 rounded-full blur-[60px] animate-float" style={{ animationDelay: '-3s' }} />

                <div className="relative text-center max-w-sm px-6">
                    <div className="text-7xl mb-6 animate-float">⚽</div>
                    <h2 className="font-display text-3xl font-bold text-white mb-3">
                        Your Next Game <span className="gradient-text">Awaits</span>
                    </h2>
                    <p className="text-dark-400 leading-relaxed">
                        Join thousands of players across India. Find teammates, organize matches, and never play alone again.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4">
                        {['🏏', '🏸', '🏀'].map((emoji, i) => (
                            <div key={i} className="glass rounded-xl py-4 text-2xl animate-float" style={{ animationDelay: `${i * -1.5}s` }}>
                                {emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
