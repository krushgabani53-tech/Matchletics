import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CITIES, SPORTS, SKILL_LEVELS, AVAILABILITY_OPTIONS } from '../data/seedData';
import { ArrowLeft, Save, Check, MapPin, Navigation } from 'lucide-react';

export default function EditProfilePage() {
    const { currentUser, updateProfile } = useApp();
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');
    const [form, setForm] = useState({
        name: currentUser?.name || '',
        city: currentUser?.city || '',
        sports: currentUser?.sports || [],
        skillLevel: currentUser?.skillLevel || 'Beginner',
        availability: currentUser?.availability || [],
        bio: currentUser?.bio || '',
        latitude: currentUser?.latitude ?? null,
        longitude: currentUser?.longitude ?? null,
    });

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        setForm({
            name: currentUser?.name || '',
            city: currentUser?.city || '',
            sports: currentUser?.sports || [],
            skillLevel: currentUser?.skillLevel || 'Beginner',
            availability: currentUser?.availability || [],
            bio: currentUser?.bio || '',
            latitude: currentUser?.latitude ?? null,
            longitude: currentUser?.longitude ?? null,
        });
    }, [currentUser]);

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

    const useCurrentGps = () => {
        if (!navigator.geolocation) {
            setLocationStatus('GPS is not available in this browser');
            return;
        }

        setLocationStatus('Requesting your live GPS location...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                setLocationStatus('Live GPS location saved in the form');
            },
            (error) => {
                setLocationStatus(error.message || 'Unable to read GPS location');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            }
        );
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!currentUser) return null;

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

                <h1 className="section-title mb-2">Edit <span className="gradient-text">Profile</span></h1>
                <p className="section-subtitle mb-8">Keep your profile updated to find the best matches</p>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-2xl ring-2 ring-white/10" />
                        <div>
                            <p className="text-sm text-white font-medium">{currentUser.email}</p>
                            <p className="text-xs text-dark-500">Avatar generated from your name</p>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="text-sm font-medium text-white">GPS location</div>
                            <div className="text-xs text-dark-400 mt-1">
                                {form.latitude && form.longitude
                                    ? `Saved coordinates: ${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}`
                                    : 'No saved GPS coordinates yet. Use live GPS to improve nearby matches.'}
                            </div>
                            {locationStatus && <div className="text-xs text-brand-400 mt-1">{locationStatus}</div>}
                        </div>
                        <button type="button" onClick={useCurrentGps} className="btn-secondary inline-flex items-center gap-2 !px-4 !py-2 self-start sm:self-center">
                            <Navigation size={14} /> Use Current GPS
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">City</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400" />
                            <select
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="input-field pl-10 appearance-none cursor-pointer"
                            >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Sports */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">Sports</label>
                        <div className="grid grid-cols-2 gap-2">
                            {SPORTS.map(sport => (
                                <button
                                    key={sport.id}
                                    type="button"
                                    onClick={() => toggleSport(sport.id)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.sports.includes(sport.id)
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

                    {/* Skill Level */}
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

                    {/* Availability */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-3">Availability</label>
                        <div className="grid grid-cols-2 gap-2">
                            {AVAILABILITY_OPTIONS.map(avail => (
                                <button
                                    key={avail}
                                    type="button"
                                    onClick={() => toggleAvailability(avail)}
                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.availability.includes(avail)
                                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                                            : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {avail} {form.availability.includes(avail) && '✓'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">Bio</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder="Tell others about yourself..."
                            className="input-field resize-none h-28"
                            maxLength={200}
                        />
                        <p className="text-xs text-dark-500 mt-1">{form.bio.length}/200</p>
                    </div>

                    {/* Save */}
                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${saved
                                ? 'bg-brand-500 text-white'
                                : 'btn-primary'
                            }`}
                    >
                        {saved ? (
                            <><Check size={16} /> Saved!</>
                        ) : (
                            <><Save size={16} /> Save Changes</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
