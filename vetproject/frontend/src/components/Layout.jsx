import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Syringe, MapPin, Tractor, Image as ImageIcon, LogOut, HeartPulse, FileText } from 'lucide-react';

export default function Layout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/consultations', icon: <FileText size={20} />, label: 'Consultations' },
        { path: '/doctors', icon: <Stethoscope size={20} />, label: 'Find a Doctor' },
        { path: '/ai-checker', icon: <Stethoscope size={20} />, label: 'Symptom Checker' },
        { path: '/image-scan', icon: <ImageIcon size={20} />, label: 'Image Scan' },
        { path: '/vaccinations', icon: <Syringe size={20} />, label: 'Vaccinations' },
        { path: '/farm', icon: <Tractor size={20} />, label: 'Farm Management' },
        { path: '/locator', icon: <MapPin size={20} />, label: 'Emergency Vet' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            
            {/* Sidebar View */}
            <aside style={{
                width: '280px',
                background: 'white',
                borderRight: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee' }}>
                    <div style={{ background: 'var(--primary-color)', color: 'white', padding: '8px', borderRadius: '8px' }}>
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>VetSense AI</h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>Veterinary System</span>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}
                            style={({isActive}) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
                                background: isActive ? 'var(--primary-light)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'var(--transition)'
                            })}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e1e8ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>{user.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px', padding: '12px', border: 'none', background: '#ffebee', color: '#c62828', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content View Container */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Outlet />
            </main>

        </div>
    );
}
