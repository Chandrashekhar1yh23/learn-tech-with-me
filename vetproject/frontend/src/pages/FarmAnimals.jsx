import React, { useState } from 'react';
import { Tractor, Droplets, Activity, Plus } from 'lucide-react';

export default function FarmAnimals() {
    const [livestock, setLivestock] = useState([
        { id: 'C102', species: 'Cow', breed: 'Holstein', status: 'Healthy', milk: 12, lastCheck: '10 March 2026' },
        { id: 'S405', species: 'Sheep', breed: 'Merino', status: 'Under Observation', milk: 0, lastCheck: '08 March 2026' },
        { id: 'C098', species: 'Cow', breed: 'Jersey', status: 'Sick', milk: 4, lastCheck: '14 March 2026' },
    ]);

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Livestock Management</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Monitor herd health, milk production, and farm activities.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={20} /> Add Livestock Record
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {livestock.map(animal => (
                    <div key={animal.id} className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '12px', color: '#2196F3' }}>
                                    <Tractor size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>ID: {animal.id}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-light)' }}>{animal.species} • {animal.breed}</p>
                                </div>
                            </div>
                            <span style={{ 
                                padding: '4px 12px', 
                                borderRadius: '12px', 
                                background: animal.status === 'Healthy' ? '#e8f5e9' : (animal.status === 'Sick' ? '#ffebee' : '#fff3e0'),
                                color: animal.status === 'Healthy' ? '#4CAF50' : (animal.status === 'Sick' ? '#f44336' : '#FF9800'),
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                fontSize: '0.8rem'
                            }}>
                                {animal.status}
                            </span>
                        </div>
                        
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', gap: '24px' }}>
                            {animal.species === 'Cow' && (
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '4px' }}><Droplets size={14}/> Milk Yield</span>
                                    <p style={{ margin: 0, fontWeight: 600 }}>{animal.milk} Litres/day</p>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '4px' }}><Activity size={14}/> Last Health Check</span>
                                <p style={{ margin: 0, fontWeight: 600 }}>{animal.lastCheck}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
