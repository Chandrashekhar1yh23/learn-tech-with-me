import React, { useState } from 'react';
import axios from 'axios';
import { Stethoscope, AlertTriangle, Send, Loader2 } from 'lucide-react';

export default function SymptomChecker() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkSymptoms = async () => {
        if (!symptoms.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post('http://localhost:5000/api/ai/symptom-checker', { symptoms });
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Stethoscope size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>AI Symptom Checker</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Describe what's wrong with your animal in plain text. Our AI will analyze the symptoms and suggest possible conditions.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px', marginBottom: '2rem', background: 'white' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Describe Symptoms</label>
                <textarea 
                    className="input-control" 
                    rows="4"
                    placeholder="e.g. My dog has been vomiting and has a slight fever since yesterday..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    style={{ resize: 'vertical', fontSize: '1rem', marginBottom: '16px' }}
                />
                
                <button 
                    className="btn btn-primary" 
                    style={{ padding: '12px 32px', fontSize: '1.1rem', width: '100%' }}
                    onClick={checkSymptoms}
                    disabled={loading || !symptoms.trim()}
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    {loading ? 'Analyzing...' : 'Analyze Symptoms'}
                </button>
            </div>

            {result && (
                <div className="glass-panel animate-fade-in" style={{ 
                    padding: '32px', 
                    borderLeft: `6px solid ${result.urgency === 'High' ? '#f44336' : 'var(--accent-color)'}`,
                    background: result.urgency === 'High' ? '#fff9f9' : 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <AlertTriangle color={result.urgency === 'High' ? '#f44336' : 'var(--accent-color)'} size={28} />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-dark)' }}>Prediction Result</h2>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Possible Condition</span>
                            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>{result.condition}</p>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Recommendation</span>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', margin: 0 }}>{result.recommendation}</p>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Urgency Level</span>
                            <p style={{ 
                                display: 'inline-block', 
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                background: result.urgency === 'High' ? '#ffebee' : '#fff3e0',
                                color: result.urgency === 'High' ? '#c62828' : '#e65100',
                                fontWeight: 700,
                                margin: '4px 0 0 0'
                            }}>
                                {result.urgency}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
