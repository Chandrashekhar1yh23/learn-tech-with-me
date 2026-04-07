import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Mail, MessageCircle, CalendarPlus, MapPin, Award, Clock, PlusCircle, Trash2 } from 'lucide-react';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMessage, setActionMessage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // New Doctor Form State
    const [formData, setFormData] = useState({
        name: '', specialization: '', experience: '', qualification: '', 
        clinicLocation: '', contactPhone: '', contactEmail: '', availableHours: ''
    });
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/doctors');
            setDoctors(data);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDoctor = async (doctorId, doctorName) => {
        if (!window.confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`);
            setActionMessage(`Dr. ${doctorName} has been removed.`);
            setDoctors(doctors.filter(d => d._id !== doctorId));
            setTimeout(() => setActionMessage(null), 3000);
        } catch (error) {
            console.error('Failed to delete doctor', error);
            alert('Failed to delete doctor profile.');
        }
    };

    const handleAction = (type, doctorName) => {
        setActionMessage(`Initiating ${type} with ${doctorName}...`);
        setTimeout(() => setActionMessage(null), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            formDataObj.append('userId', user.id || '64c67f4c5e3d7b0012c8a9f0');
            
            for (const key in formData) {
                formDataObj.append(key, formData[key]);
            }
            if (profilePhotoFile) {
                formDataObj.append('profilePhotoFile', profilePhotoFile);
            }

            await axios.post('http://localhost:5000/api/doctors', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setShowForm(false);
            setFormData({ name: '', specialization: '', experience: '', qualification: '', clinicLocation: '', contactPhone: '', contactEmail: '', availableHours: '' });
            setProfilePhotoFile(null);
            fetchDoctors(); // Refresh list
            setActionMessage('Dr. ' + formData.name + ' was added successfully.');
            setTimeout(() => setActionMessage(null), 3500);
        } catch (err) {
            alert('Error adding new doctor profile.');
        }
    };

    const handleBooking = async (doctorId, doctorName) => {
        setActionMessage(`Requesting appointment with ${doctorName}...`);
        
        try {
            await axios.post('http://localhost:5000/api/doctors/book', {
                userId: user.id || '64c67f4c5e3d7b0012c8a9f0',
                doctorId: doctorId,
                appointmentDate: new Date(Date.now() + 86400000).toLocaleDateString() // Mock tomorrow's date
            });
            
            setActionMessage(`Appointment booked with ${doctorName}! Email and SMS confirmations sent.`);
        } catch (error) {
            console.error(error);
            setActionMessage(`Failed to book appointment.`);
        }
        
        setTimeout(() => setActionMessage(null), 4000);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading directories...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Find a Doctor</h1>
                    <p style={{ color: 'var(--text-light)' }}>Connect with our certified veterinary professionals.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <PlusCircle size={20} /> {showForm ? 'Cancel Form' : 'Add New Doctor'}
                </button>
            </div>

            {actionMessage && (
                <div style={{ padding: '12px 20px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '8px', marginBottom: '2rem', fontWeight: 600 }}>
                    {actionMessage}
                </div>
            )}

            {showForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '2px solid var(--primary-light)' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Register New Professional</h2>
                    <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input name="name" type="text" className="input-control" placeholder="Dr. John Doe" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Specialization</label>
                            <input name="specialization" type="text" className="input-control" placeholder="E.g. Large Animal Surgery" value={formData.specialization} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Qualification</label>
                            <input name="qualification" type="text" className="input-control" placeholder="DVM, MVSc" value={formData.qualification} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Experience</label>
                            <input name="experience" type="text" className="input-control" placeholder="E.g. 10 Years" value={formData.experience} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Clinic Location</label>
                            <input name="clinicLocation" type="text" className="input-control" placeholder="123 Vet Street, City" value={formData.clinicLocation} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Available Hours</label>
                            <input name="availableHours" type="text" className="input-control" placeholder="Mon-Fri (9 AM - 6 PM)" value={formData.availableHours} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Contact Phone</label>
                            <input name="contactPhone" type="text" className="input-control" placeholder="+1 234 567 8900" value={formData.contactPhone} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Contact Email</label>
                            <input name="contactEmail" type="email" className="input-control" placeholder="doc@vetsense.ai" value={formData.contactEmail} onChange={handleInputChange} required />
                        </div>
                        <div className="input-group">
                            <label>Profile Photo</label>
                            <input type="file" accept="image/*" className="input-control" onChange={e => setProfilePhotoFile(e.target.files[0])} style={{ padding: '8px' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Save Profile</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {doctors.map(doc => (
                    <div key={doc._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', position: 'relative' }}>
                            <img src={doc.profilePhoto} alt={doc.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} />
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', margin: '0 0 4px 0' }}>{doc.name}</h3>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{doc.specialization}</div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{doc.qualification}</div>
                            </div>
                            <button 
                                onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                                style={{ position: 'absolute', top: 0, right: 0, background: '#ffebee', color: '#c62828', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Delete Profile"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                <Award size={16} color="var(--primary-color)"/> <strong>Experience:</strong> {doc.experience}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                <MapPin size={16} color="var(--primary-color)"/> {doc.clinicLocation}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                                <Clock size={16} color="var(--primary-color)"/> {doc.availableHours}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button onClick={() => window.location.href=`tel:${doc.contactPhone}`} className="btn" style={{ background: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Phone size={16} /> Call
                            </button>
                            <button onClick={() => window.location.href=`mailto:${doc.contactEmail}`} className="btn" style={{ background: '#fce4ec', color: '#c2185b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Mail size={16} /> Email
                            </button>
                            <button onClick={() => handleAction('Live Chat', doc.name)} className="btn" style={{ background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <MessageCircle size={16} /> Chat
                            </button>
                            <button onClick={() => handleBooking(doc._id, doc.name)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <CalendarPlus size={16} /> Book
                            </button>
                        </div>
                    </div>
                ))}
                {doctors.length === 0 && <p>No doctors available at the moment.</p>}
            </div>
        </div>
    );
}
