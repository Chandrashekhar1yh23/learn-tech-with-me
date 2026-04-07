import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, CarFront, Navigation } from 'lucide-react';

export default function VetLocator() {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Mock geolocation and fetching for now
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    fetchClinics(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    // Fallback to default
                    fetchClinics(34.0522, -118.2437);
                }
            );
        } else {
            fetchClinics(34.0522, -118.2437);
        }
    }, []);

    const fetchClinics = async (lat, lng) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/clinics/nearest?lat=${lat}&lng=${lng}`);
            setClinics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Emergency Vet Locator</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Find the nearest emergency veterinary clinics based on your GPS location.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', flex: 1 }}>
                
                {/* List View */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '10px' }}>
                    {loading ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>Finding nearest clinics...</div>
                    ) : (
                        clinics.map(clinic => (
                            <div key={clinic.id} className="glass-panel" style={{ padding: '20px', transition: 'var(--transition)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.2rem' }}>{clinic.name}</h3>
                                        <p style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                            <MapPin size={16} /> {clinic.address}
                                        </p>
                                    </div>
                                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {clinic.distance} away
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                    <button className="btn btn-primary" style={{ flex: 1, padding: '8px' }}><Navigation size={16}/> Directions</button>
                                    <button className="btn" style={{ flex: 1, padding: '8px', background: '#ffebee', color: '#c62828' }}><Phone size={16}/> Emergency call</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Map Mock View */}
                <div className="glass-panel" style={{ 
                    position: 'relative', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    background: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Placeholder for actual Google Maps or Leaflet Integration */}
                    <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>
                        <MapPin size={64} color="#2196F3" opacity={0.5} style={{ marginBottom: '16px' }} />
                        <h3>Interactive Map Overlay</h3>
                        <p>Automatically centers based on GPS Coordinates ({userLocation?.lat.toFixed(2)}, {userLocation?.lng.toFixed(2)})</p>
                        <p>Integrates Mapbox or Google Maps SDK here.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
