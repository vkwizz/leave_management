import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar" style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: '#2563eb' }}>
                <span>LMS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    <User size={20} />
                    <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </div>
                <button
                    onClick={logout}
                    className="btn btn-outline"
                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
