import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIES, SPORTS } from '../data/seedData';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Type, FileText, Check } from 'lucide-react';

export default function CreateEventPage() {
    const { createEvent } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        sport: '',
        city: '',
        date: '',
        time: '',
        maxPlayers: 10,
        description: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.sport || !form.city || !form.date || !form.time) {
            setError('Please fill in all required fields');
            return;
        }
        
        const eventDateTime = new Date(`${form.date}T${form.time}`);
        if (eventDateTime < new Date()) {
            setError('Event date and time must be in the future');
            return;
        }

        createEvent(form);
        navigate('/events');
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <h1 className="section-title mb-2">Create an <span className="gradient-text">Event</span></h1>
                <p className="section-subtitle mb-8">Organize an open match and invite players from your city</p>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Event Title *</label>
                        <div className="relative">
                            <Type size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Sunday Football League"
                                className="input-field pl-10"
                                required
                            />
                        </div>
                    </div>

                    {/* Sport */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">Sport *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SPORTS.map(sport => (
                                <button
                                    key={sport.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, sport: sport.id })}
                                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-medium border transition-all ${form.sport === sport.id
                                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                            : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-lg">{sport.emoji}</span>
                                    <span className="text-xs">{sport.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">
                            <MapPin size={16} className="inline mr-2 text-ocean-400" />
                            Select City *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Date *</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                                <input
                                    type="date"
                                    value={form.date}
                                    min={today}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Time *</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="input-field pl-10"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Max Players */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Max Players</label>
                        <div className="relative">
                            <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                            <input
                                type="number"
                                min="2"
                                max="50"
                                value={form.maxPlayers}
                                onChange={(e) => setForm({ ...form, maxPlayers: parseInt(e.target.value) || 10 })}
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                        <div className="relative">
                            <FileText size={16} className="absolute left-3.5 top-3 text-dark-500" />
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Describe the event, venue, rules, etc."
                                className="input-field pl-10 resize-none h-28"
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5">
                        <Check size={16} />
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
}
