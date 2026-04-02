import { SPORTS } from '../data/seedData';

export default function SportFilter({ selected, onChange }) {
    const toggleSport = (sportId) => {
        if (selected.includes(sportId)) {
            onChange(selected.filter(s => s !== sportId));
        } else {
            onChange([...selected, sportId]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onChange([])}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${selected.length === 0
                        ? 'bg-brand-500/15 text-brand-400 border-brand-500/30 shadow-sm shadow-brand-500/10'
                        : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
            >
                All Sports
            </button>
            {SPORTS.map(sport => (
                <button
                    key={sport.id}
                    onClick={() => toggleSport(sport.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${selected.includes(sport.id)
                            ? 'bg-brand-500/15 text-brand-400 border-brand-500/30 shadow-sm shadow-brand-500/10'
                            : 'bg-white/5 text-dark-400 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span>{sport.emoji}</span>
                    <span className="hidden sm:inline">{sport.name}</span>
                </button>
            ))}
        </div>
    );
}
