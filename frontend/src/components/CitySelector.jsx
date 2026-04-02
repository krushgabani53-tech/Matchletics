import { CITIES } from '../data/seedData';
import { MapPin, ChevronDown } from 'lucide-react';

export default function CitySelector({ value, onChange, playerCounts = {}, showAll = true }) {
    return (
        <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field pl-10 pr-10 appearance-none cursor-pointer"
            >
                {showAll && <option value="" className="bg-dark-950 text-white">All Cities</option>}
                {CITIES.map(city => (
                    <option key={city} value={city} className="bg-dark-950 text-white">
                        {city} {playerCounts[city] ? `(${playerCounts[city]} players)` : ''}
                    </option>
                ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
        </div>
    );
}
