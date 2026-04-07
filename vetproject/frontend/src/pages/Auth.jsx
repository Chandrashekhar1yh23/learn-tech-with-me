import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero_banner.png';
import { PawPrint, Mail, Lock, User, ShieldCheck } from 'lucide-react';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [isOTPPhase, setIsOTPPhase] = useState(false);
    const navigate = useNavigate();
    const location = new URLSearchParams(window.location.search);
    const isVerified = location.get('verified') === 'true';
    
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Owner');
    
    const [otpCode, setOtpCode] = useState('');
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (isOTPPhase) {
                // Submit OTP
                const { data } = await axios.post('http://localhost:5000/api/auth/verify-otp', { userId, otpCode });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
                return;
            }

            const payload = isLogin ? { email, password } : { name, email, password, role };
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);
            
            if (data.requiresOTP) {
                setUserId(data.userId);
                setIsOTPPhase(true);
                setMessage({ type: 'success', text: data.message });
            } else if (!isLogin) {
                setMessage({ type: 'success', text: data.message }); // Registration success message
                setIsLogin(true); // flip back to login
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error authenticating' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: 'var(--bg-color)'
        }}>
            {/* Left Image Section */}
            <div style={{
                flex: 1,
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.4), rgba(0,0,0,0.6))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '4rem',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }} className="animate-fade-in">
                        VetSense AI
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '500px' }} className="animate-fade-in">
                        The ultimate modern veterinary ecosystem for veterinarians, farmers, and pet lovers alike. Empowering better lives for animals through smart technology.
                    </p>
                </div>
            </div>

            {/* Right Auth Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
                    
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                            {isOTPPhase ? <ShieldCheck size={32} /> : <PawPrint size={32} />}
                        </div>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>
                            {isOTPPhase ? 'Two-Factor Auth' : (isLogin ? 'Welcome Back!' : 'Create an Account')}
                        </h2>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                            {isOTPPhase ? 'Enter the 6-digit OTP sent via SMS' : (isLogin ? 'Sign in to access your dashboard' : 'Join our vibrant veterinary network')}
                        </p>
                    </div>

                    {message && (
                        <div style={{
                            padding: '12px', marginBottom: '16px', borderRadius: '8px', fontSize: '0.9rem',
                            background: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                            color: message.type === 'error' ? '#c62828' : '#2e7d32'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {isVerified && !message && (
                        <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', fontSize: '0.9rem', background: '#e8f5e9', color: '#2e7d32' }}>
                            Email verified successfully! You may now sign in.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isOTPPhase ? (
                            <div className="input-group" style={{ marginBottom: '2rem' }}>
                                <label><Lock size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> 6-Digit OTP</label>
                                <input type="text" maxLength={6} className="input-control" placeholder="123456" value={otpCode} onChange={e => setOtpCode(e.target.value)} required />
                            </div>
                        ) : (
                            <>
                                {!isLogin && (
                                    <>
                                        <div className="input-group">
                                            <label><User size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Full Name</label>
                                            <input type="text" className="input-control" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                                        </div>
                                        <div className="input-group">
                                            <label><ShieldCheck size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Select Role</label>
                                            <select className="input-control" value={role} onChange={e => setRole(e.target.value)}>
                                                <option value="Owner">Pet/Farm Owner</option>
                                                <option value="Vet">Veterinarian</option>
                                                <option value="Admin">Administrator</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="input-group">
                                    <label><Mail size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Email Address</label>
                                    <input type="email" className="input-control" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="input-group" style={{ marginBottom: '2rem' }}>
                                    <label><Lock size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}}/> Password</label>
                                    <input type="password" className="input-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>
                            {loading ? 'Processing...' : (isOTPPhase ? 'Verify OTP' : (isLogin ? 'Sign In' : 'Sign Up'))}
                        </button>
                    </form>

                    {!isOTPPhase && (
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-light)' }}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span style={{ color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Register Here' : 'Log In Here'}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
