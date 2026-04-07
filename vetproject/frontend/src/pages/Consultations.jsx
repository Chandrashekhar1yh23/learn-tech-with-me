import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Camera, Upload, Send, Stethoscope, Clock, CheckCircle } from 'lucide-react';

export default function Consultations() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'new'
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Form State
    const [petName, setPetName] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [images, setImages] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!user.id) return setLoading(false);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/consultations/${user.id}`);
            setHistory(data);
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImages([file]);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('userId', user.id);
            formData.append('petName', petName);
            formData.append('symptoms', symptoms);
            if (images && images.length > 0) {
                formData.append('images', images[0]);
            }

            await axios.post('http://localhost:5000/api/consultations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setPetName('');
            setSymptoms('');
            setImages(null);
            setPreviewURL(null);
            setActiveTab('history');
            fetchHistory();
        } catch (error) {
            alert('Error submitting consultation');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading records...</div>;

    return (
        <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Consultation Records</h1>
                    <p style={{ color: 'var(--text-light)' }}>View medical history and submit new consultation requests.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        className={`btn ${activeTab === 'history' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('history')}
                        style={activeTab !== 'history' ? { background: '#f5f5f5', color: '#666' } : {}}
                    >
                        History
                    </button>
                    <button 
                        className={`btn ${activeTab === 'new' ? 'btn-primary' : ''}`}
                        onClick={() => setActiveTab('new')}
                        style={activeTab !== 'new' ? { background: '#f5f5f5', color: '#666' } : {}}
                    >
                        New Request
                    </button>
                </div>
            </div>

            {activeTab === 'history' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                            <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                            <h3>No Consultation History Found</h3>
                            <p>You haven't submitted any consultation requests yet.</p>
                            <button className="btn btn-primary" onClick={() => setActiveTab('new')} style={{ marginTop: '1rem' }}>Start New Consultation</button>
                        </div>
                    ) : (
                        history.map((record) => (
                            <div key={record._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '24px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{record.petName}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {new Date(record.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div style={{ marginBottom: '1.5rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                                        <div style={{ fontWeight: 600, color: '#e65100', marginBottom: '4px', fontSize: '0.9rem' }}>Symptoms</div>
                                        <p style={{ margin: 0, color: 'var(--text-dark)' }}>{record.symptoms}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Stethoscope size={16}/> Diagnosis
                                            </div>
                                            <p style={{ margin: 0, color: record.diagnosis === 'Pending Review' ? '#f57c00' : '#2e7d32', fontWeight: 500 }}>
                                                {record.diagnosis}
                                            </p>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-light)', marginBottom: '4px', fontSize: '0.9rem' }}>Prescription</div>
                                            <p style={{ margin: 0, color: 'var(--text-dark)' }}>{record.prescription}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                {record.images && record.images.length > 0 && (
                                    <div style={{ width: '150px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                                        <div style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
                                            <FileText size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                                            <div>Image Attached</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div className="input-group">
                            <label>Patient/Pet Name</label>
                            <input 
                                type="text" className="input-control" required
                                value={petName} onChange={(e) => setPetName(e.target.value)}
                                placeholder="E.g. Buddy, Luna, Cow #102" 
                            />
                        </div>

                        <div className="input-group">
                            <label>Detailed Symptoms</label>
                            <textarea 
                                className="input-control" rows="4" required
                                value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Describe what the animal is experiencing (e.g., vomiting since morning, lethargic)..."
                            />
                        </div>

                        <div className="input-group">
                            <label>Capture / Upload Image (Optional)</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="cameraUpload" style={{
                                        display: 'block', padding: '1.5rem', border: '2px dashed #ccc', borderRadius: '12px',
                                        textAlign: 'center', cursor: 'pointer', background: '#fafafa', transition: '0.3s'
                                    }}>
                                        <Camera size={32} style={{ color: 'var(--primary-color)', marginBottom: '8px' }} />
                                        <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>Take Photo / Upload Image</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tap to open device camera or gallery</div>
                                        {/* capture="environment" ensures mobile devices prefer back camera */}
                                        <input 
                                            type="file" 
                                            id="cameraUpload" 
                                            accept="image/*" 
                                            capture="environment" 
                                            style={{ display: 'none' }} 
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                {previewURL && (
                                    <div style={{ width: '150px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        <img src={previewURL} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-end', padding: '12px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {isSubmitting ? 'Sending Request...' : <><Send size={18} /> Submit Consultation</>}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
