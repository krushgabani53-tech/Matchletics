import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { MapPin, Navigation, UserCircle2 } from 'lucide-react';
import { formatDistance, haversineDistanceKm, toLocation } from '../utils/location';
import 'leaflet/dist/leaflet.css';

function MapController({ center }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView([center.latitude, center.longitude], map.getZoom(), { animate: true });
        }
    }, [center, map]);

    return null;
}

function createMarkerIcon(label, color) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                width: 34px;
                height: 34px;
                border-radius: 9999px;
                background: ${color};
                border: 3px solid rgba(15, 15, 26, 0.95);
                box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.04em;
            ">${label}</div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -14],
    });
}

export default function NearbyMap({ currentLocation, players = [], radiusKm = 10, onUseGps, gpsStatus = 'Using your saved location' }) {
    const mapCenter = currentLocation || toLocation(19.076, 72.8777);

    const playerMarkers = useMemo(() => {
        return players
            .map((player) => {
                const location = toLocation(player.latitude, player.longitude);
                if (!location) {
                    return null;
                }

                const distanceKm = currentLocation ? haversineDistanceKm(currentLocation, location) : null;
                return {
                    ...player,
                    location,
                    distanceKm,
                };
            })
            .filter(Boolean);
    }, [players, currentLocation]);

    const nearbyCount = playerMarkers.filter((player) => {
        if (!currentLocation || !Number.isFinite(player.distanceKm)) {
            return true;
        }

        return player.distanceKm <= radiusKm;
    }).length;

    if (!mapCenter) {
        return (
            <div className="card space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                        <Navigation size={18} />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold text-white">Nearby map</h3>
                        <p className="text-sm text-dark-400">Turn on GPS to see players around you.</p>
                    </div>
                </div>
                <button type="button" onClick={onUseGps} className="btn-primary inline-flex items-center gap-2">
                    <UserCircle2 size={16} /> Enable GPS
                </button>
            </div>
        );
    }

    return (
        <div className="card space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold text-white">Nearby map</h3>
                        <p className="text-sm text-dark-400">{gpsStatus}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-dark-400">
                    <span className="badge-city">{nearbyCount} visible players</span>
                    <button type="button" onClick={onUseGps} className="btn-secondary !px-4 !py-2 inline-flex items-center gap-2 text-sm">
                        <Navigation size={14} /> Refresh GPS
                    </button>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-dark-900/80 shadow-2xl shadow-black/30">
                <div className="h-[420px] relative">
                    <MapContainer center={[mapCenter.latitude, mapCenter.longitude]} zoom={12} scrollWheelZoom className="h-full w-full">
                        <MapController center={mapCenter} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Circle
                            center={[mapCenter.latitude, mapCenter.longitude]}
                            radius={radiusKm * 1000}
                            pathOptions={{ color: '#09dc5e', fillColor: '#09dc5e', fillOpacity: 0.08, weight: 1 }}
                        />

                        <Marker
                            position={[mapCenter.latitude, mapCenter.longitude]}
                            icon={createMarkerIcon('YOU', '#09dc5e')}
                        >
                            <Popup>
                                <div className="space-y-1 text-dark-950">
                                    <div className="font-semibold">Your location</div>
                                    <div className="text-sm">GPS center for nearby matches</div>
                                </div>
                            </Popup>
                        </Marker>

                        {playerMarkers.map((player) => {
                            const withinRadius = !currentLocation || !Number.isFinite(player.distanceKm) || player.distanceKm <= radiusKm;

                            return (
                                <Marker
                                    key={player.id}
                                    position={[player.location.latitude, player.location.longitude]}
                                    icon={createMarkerIcon(player.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(), withinRadius ? '#3b82f6' : '#6b7280')}
                                >
                                    <Popup>
                                        <div className="space-y-2 text-dark-950 min-w-[180px]">
                                            <div className="font-semibold leading-tight">{player.name}</div>
                                            <div className="text-sm text-dark-700 flex items-center gap-1">
                                                <MapPin size={12} />
                                                {player.city}
                                            </div>
                                            {Number.isFinite(player.distanceKm) && (
                                                <div className="text-sm text-dark-700">{formatDistance(player.distanceKm)}</div>
                                            )}
                                            <Link to={`/profile/${player.id}`} className="inline-flex items-center justify-center rounded-lg bg-dark-950 px-3 py-2 text-sm font-semibold text-white hover:bg-dark-800 transition-colors">
                                                View profile
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-dark-400">
                <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20">Live GPS optional</span>
                <span className="badge bg-ocean-500/15 text-ocean-400 border border-ocean-500/20">City fallback supported</span>
                <span className="badge bg-white/5 text-dark-300 border border-white/10">Radius: {radiusKm} km</span>
            </div>
        </div>
    );
}
