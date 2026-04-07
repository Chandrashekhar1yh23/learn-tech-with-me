import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';

export default function ImageDetection() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const { data } = await axios.post('http://localhost:5000/api/ai/image-detection', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data.result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <ImageIcon size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Pet Image Disease Detection</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Upload an image of your pet's skin, eye, or ear. Our computer vision AI will analyze it instantly.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', marginBottom: '2rem' }}>
                {!preview ? (
                    <div style={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: '16px', 
                        padding: '4rem 2rem', 
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
                    >
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                            id="file-upload" 
                        />
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <UploadCloud size={48} color="var(--text-light)" style={{ marginBottom: '16px' }} />
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Click to upload an image</h3>
                            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Supports JPG, PNG (Max 5MB)</p>
                        </label>
                    </div>
                ) : (
                    <div>
                        <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', marginBottom: '24px', objectFit: 'cover' }} />
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button className="btn" style={{ background: '#eee' }} onClick={() => {setPreview(''); setSelectedFile(null); setResult(null);}}>Select Another</button>
                            <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Run AI Analysis'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {result && (
                <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderLeft: '6px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <CheckCircle color="var(--primary-color)" size={28} />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-dark)' }}>Analysis Complete</h2>
                    </div>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Detection</span>
                            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>{result.detection}</p>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Action Plan</span>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', margin: 0 }}>{result.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
