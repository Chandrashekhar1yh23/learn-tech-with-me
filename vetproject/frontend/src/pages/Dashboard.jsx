import React from 'react';
import { Activity, Bell, Calendar, ShieldAlert, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                    Welcome back, {user.name}! 👋
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                    Here's what's happening with your animals today.
                </p>
            </header>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
                <StatCard title="Total Animals" value="4" icon={<Activity />} color="#4CAF50" bg="#e8f5e9" />
                <StatCard title="Upcoming Vaccines" value="2" icon={<ShieldAlert />} color="#FF9800" bg="#fff3e0" />
                <StatCard title="Appointments" value="1" icon={<Calendar />} color="#2196F3" bg="#e3f2fd" />
                <StatCard title="Alerts" value="0" icon={<Bell />} color="#f44336" bg="#ffebee" />
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--text-dark)' }}>Recent Activity</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <ActivityItem text="Buddy's Rabies Vaccination completed." time="2 days ago" />
                            <ActivityItem text="Consultation with Dr. Sharma for Luna." time="1 week ago" />
                            <ActivityItem text="New milk production record for C-102 added." time="2 weeks ago" />
                        </ul>
                    </div>
                    
                    {/* Disease-Based Consultation Fee Section */}
                    <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderLeft: '4px solid #9C27B0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <DollarSign size={22} color="#9C27B0" />
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>Consultation Fee Chart</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            {[
                                { disease: 'Normal Checkup', fee: '₹300', color: '#4CAF50', bg: '#e8f5e9' },
                                { disease: 'Skin Disease / Dermatitis', fee: '₹500', color: '#FF9800', bg: '#fff3e0' },
                                { disease: 'Minor Surgery / Wound Care', fee: '₹800', color: '#2196F3', bg: '#e3f2fd' },
                                { disease: 'Fever / Infection', fee: '₹400', color: '#E91E63', bg: '#fce4ec' },
                                { disease: 'Fracture / Orthopedic', fee: '₹1200', color: '#9C27B0', bg: '#f3e5f5' },
                                { disease: 'Dental & Eye Care', fee: '₹600', color: '#00BCD4', bg: '#e0f7fa' },
                                { disease: 'Vaccination Visit', fee: '₹250', color: '#607D8B', bg: '#eceff1' },
                                { disease: 'Emergency / Critical Care', fee: '₹2000+', color: '#f44336', bg: '#ffebee' },
                            ].map(({ disease, fee, color, bg }) => (
                                <div key={disease} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: bg }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500 }}>{disease}</span>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: color }}>{fee}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ margin: '12px 0 0 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>* Fees may vary based on doctor and clinic. Consult for exact pricing.</p>
                    </div>
                </div>
                
                <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button className="btn" onClick={() => navigate('/doctors')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Book Appointment</button>
                        <button className="btn" onClick={() => navigate('/farm')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Add New Animal</button>
                        <button className="btn" onClick={() => navigate('/ai-checker')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Run AI Symptom Check</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon, color, bg }) => (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <div>
            <h4 style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{value}</span>
        </div>
    </div>
);

const ActivityItem = ({ text, time }) => (
    <li style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.95rem' }}>{text}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{time}</span>
    </li>
);
