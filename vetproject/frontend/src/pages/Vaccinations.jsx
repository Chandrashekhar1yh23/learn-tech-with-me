import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Syringe, CalendarCheck, CalendarOff, Plus, CheckCircle, Clock } from 'lucide-react';

export default function Vaccinations() {
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [formData, setFormData] = useState({
        animalName: '', vaccineName: '', dueDate: '', status: 'Pending'
    });

    useEffect(() => {
        fetchVaccinations();
    }, []);

    const fetchVaccinations = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/vaccinations/${user.id || '64c67f4c5e3d7b0012c8a9f0'}`);
            setVaccinations(data);
        } catch (error) {
            console.error('Failed to fetch vaccinations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/vaccinations', { 
                ...formData, 
                userId: user.id || '64c67f4c5e3d7b0012c8a9f0' 
            });
            setShowForm(false);
            setFormData({ animalName: '', vaccineName: '', dueDate: '', status: 'Pending' });
            fetchVaccinations();
            
            setActionMessage('Vaccination record saved successfully.');
            setTimeout(() => setActionMessage(null), 3000);
        } catch (err) {
            alert('Error creating record');
        }
    };

    const markAsCompleted = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/vaccinations/${id}`);
            fetchVaccinations();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const getStatusStyles = (status, date) => {
        const isMissed = new Date(date) < new Date() && status === 'Pending';
        if (status === 'Completed') return { color: "#4CAF50", bg: "#e8f5e9", text: 'Completed', icon: <CheckCircle size={16}/> };
        if (isMissed) return { color: "#f44336", bg: "#ffebee", text: 'Missed', icon: <CalendarOff size={16}/> };
        return { color: "#FF9800", bg: "#fff3e0", text: 'Pending', icon: <Clock size={16}/> };
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading records...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Smart Vaccination Tracker</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Manage and track upcoming vaccines for your animals.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Plus size={20} /> {showForm ? 'Cancel Form' : 'Add Record'}
                </button>
            </header>

            {actionMessage && (
                <div style={{ padding: '12px 20px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '8px', marginBottom: '2rem', fontWeight: 600 }}>
                    {actionMessage}
                </div>
            )}

            {showForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '2px solid var(--primary-light)' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Log New Vaccination</h2>
                    <form onSubmit={handleAddRecord} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group">
                            <label>Animal Name / Tag</label>
                            <input name="animalName" type="text" className="input-control" placeholder="E.g. Buddy or Tag #102" value={formData.animalName} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Vaccine Name</label>
                            <input name="vaccineName" type="text" className="input-control" placeholder="E.g. Rabies, FMD, Parvovirus" value={formData.vaccineName} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Due Date</label>
                            <input name="dueDate" type="date" className="input-control" value={formData.dueDate} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Current Status</label>
                            <select name="status" className="input-control" value={formData.status} onChange={handleInputChange}>
                                <option value="Pending">Pending (Future)</option>
                                <option value="Completed">Completed (Administered)</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Save Record</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
                {vaccinations.length === 0 && !showForm ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        <Syringe size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <h3>No Vaccination Records Found</h3>
                        <p>Click "Add Record" to start tracking your animals' health timeline.</p>
                    </div>
                ) : (
                    vaccinations.map(v => {
                        const style = getStatusStyles(v.status, v.dueDate);
                        
                        return (
                            <div key={v._id} className="glass-panel" style={{ 
                                padding: '20px 24px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                borderLeft: `4px solid ${style.color}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Syringe />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{v.vaccineName} Tracker</h3>
                                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Patient/Animal: <strong>{v.animalName}</strong></p>
                                    </div>
                                </div>
        
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginBottom: '6px' }}>
                                            {v.status === 'Completed' ? <CalendarCheck size={16} color="var(--primary-color)" /> : <CalendarOff size={16} color="var(--text-light)" />}
                                            <span style={{ fontWeight: 600 }}>Due: {new Date(v.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        <span style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '4px 12px', borderRadius: '12px', background: style.bg, color: style.color, 
                                            fontSize: '0.8rem', fontWeight: 700 
                                        }}>
                                            {style.icon} {style.text}
                                        </span>
                                    </div>
                                    {v.status === 'Pending' && (
                                        <button onClick={() => markAsCompleted(v._id)} className="btn" style={{ background: '#e3f2fd', color: '#1565c0', fontSize: '0.85rem', padding: '8px 16px' }}>
                                            Mark Done
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
