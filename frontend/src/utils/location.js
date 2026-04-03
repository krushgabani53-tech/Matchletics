export const CITY_COORDINATES = {
    Mumbai: { latitude: 19.076, longitude: 72.8777 },
    Delhi: { latitude: 28.6139, longitude: 77.209 },
    Bangalore: { latitude: 12.9716, longitude: 77.5946 },
    Pune: { latitude: 18.5204, longitude: 73.8567 },
    Hyderabad: { latitude: 17.385, longitude: 78.4867 },
    Chennai: { latitude: 13.0827, longitude: 80.2707 },
    Kolkata: { latitude: 22.5726, longitude: 88.3639 },
    Ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
    Jaipur: { latitude: 26.9124, longitude: 75.7873 },
    Lucknow: { latitude: 26.8467, longitude: 80.9462 },
    Chandigarh: { latitude: 30.7333, longitude: 76.7794 },
    Goa: { latitude: 15.2993, longitude: 74.124 },
    Indore: { latitude: 22.7196, longitude: 75.8577 },
    Bhopal: { latitude: 23.2599, longitude: 77.4126 },
    Kochi: { latitude: 9.9312, longitude: 76.2673 },
};

export function toLocation(latitude, longitude) {
    const resolvedLatitude = Number(latitude);
    const resolvedLongitude = Number(longitude);

    if (!Number.isFinite(resolvedLatitude) || !Number.isFinite(resolvedLongitude)) {
        return null;
    }

    return {
        latitude: resolvedLatitude,
        longitude: resolvedLongitude,
    };
}

export function getCityLocation(city) {
    if (!city || !CITY_COORDINATES[city]) {
        return null;
    }

    return {
        ...CITY_COORDINATES[city],
        locationSource: 'city',
    };
}

export function getUserLocation(user) {
    if (!user) {
        return null;
    }

    const directLocation = toLocation(user.latitude, user.longitude);
    if (directLocation) {
        return {
            ...directLocation,
            locationSource: user.locationSource || 'saved',
        };
    }

    return getCityLocation(user.city);
}

export function haversineDistanceKm(fromLocation, toLocation) {
    if (!fromLocation || !toLocation) {
        return null;
    }

    const earthRadiusKm = 6371;
    const fromLatitude = (fromLocation.latitude * Math.PI) / 180;
    const toLatitude = (toLocation.latitude * Math.PI) / 180;
    const latitudeDelta = ((toLocation.latitude - fromLocation.latitude) * Math.PI) / 180;
    const longitudeDelta = ((toLocation.longitude - fromLocation.longitude) * Math.PI) / 180;

    const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

export function formatDistance(distanceKm) {
    if (!Number.isFinite(distanceKm)) {
        return '';
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m away`;
    }

    return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km away`;
}
