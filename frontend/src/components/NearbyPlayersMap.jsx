import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const userIcon = new L.DivIcon({
    className: '',
    html: '<div style="width:14px;height:14px;border-radius:9999px;background:#16a34a;border:2px solid #ffffff;box-shadow:0 0 0 2px rgba(22,163,74,0.35);"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

const createPlayerIcon = (avatarUrl) => new L.DivIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:9999px;border:2px solid #ffffff;overflow:hidden;box-shadow:0 0 0 2px rgba(15,23,42,0.55);background:#0f172a;"><img src="${avatarUrl}" alt="player" style="width:100%;height:100%;object-fit:cover;" /></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
});

const fallbackCenter = [20.5937, 78.9629];

export default function NearbyPlayersMap({ liveLocation, players }) {
    const markerPlayers = useMemo(
        () => players.filter((player) => typeof player.latitude === 'number' && typeof player.longitude === 'number'),
        [players]
    );

    const center = useMemo(() => {
        if (liveLocation?.latitude && liveLocation?.longitude) {
            return [liveLocation.latitude, liveLocation.longitude];
        }
        if (markerPlayers.length > 0) {
            return [markerPlayers[0].latitude, markerPlayers[0].longitude];
        }
        return fallbackCenter;
    }, [liveLocation, markerPlayers]);

    return (
        <div className="card mb-8 p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
                <h3 className="font-display text-base font-semibold text-white">Live Players Map</h3>
                <p className="text-xs text-dark-400 mt-1">Friends with location sharing enabled appear here in real time.</p>
            </div>
            <div className="h-[360px] w-full">
                <MapContainer
                    center={center}
                    zoom={6}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {liveLocation?.latitude && liveLocation?.longitude && (
                        <Marker
                            position={[liveLocation.latitude, liveLocation.longitude]}
                            icon={userIcon}
                        >
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {markerPlayers.map((player) => (
                        <Marker
                            key={player.id}
                            position={[player.latitude, player.longitude]}
                            icon={createPlayerIcon(player.avatar)}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <p className="font-semibold">{player.name}</p>
                                    <p>{player.city}</p>
                                    {typeof player.distanceKm === 'number' && <p>{player.distanceKm.toFixed(1)} km away</p>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
