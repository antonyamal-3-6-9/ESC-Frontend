import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const defaultIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Normalize longitude between -180 and 180
const normalizeLongitude = (lon: number): number => {
    return ((lon + 180) % 360 + 360) % 360 - 180;
};

interface LocationPickerProps {
    onLocationSelect?: (lat: number, lng: number) => void;
    initialPosition?: [number, number];
}

// Restrict map bounds (Example: India Bounding Box)
const mapBounds: L.LatLngBoundsExpression = [
    [6.554607, 68.162385],  // Southwest corner (latitude, longitude)
    [35.675147, 97.395358]  // Northeast corner
];

const MapClickHandler = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            // lng = normalizeLongitude(lng); // Normalize longitude
            onLocationSelect?.(lat, lng);
        }
    });
    return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialPosition = [9.955388, 76.244921] }) => {
    const [position, setPosition] = useState<[number, number]>([
        initialPosition[0],
        normalizeLongitude(initialPosition[1])
    ]);
    const [hasLocation, setHasLocation] = useState(false);

    const handleLocationSelect = (lat: number, lng: number) => {
        // lng = normalizeLongitude(lng);
        setPosition([lat, lng]);
        setHasLocation(true);
        onLocationSelect?.(lat, lng);
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer
                center={position}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                maxBounds={mapBounds}  // Restrict movement
                maxBoundsViscosity={1.0}  // Strongly enforce bounds
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                {hasLocation && <Marker position={position} icon={defaultIcon} />}
            </MapContainer>

            {hasLocation && (
                <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    backgroundColor: 'white',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}>
                    <strong>Selected:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
