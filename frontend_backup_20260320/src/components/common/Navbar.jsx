import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard" className="navbar-logo">
                    <span className="logo-icon">📋</span>
                    <span className="logo-text">TaskHub</span>
                </Link>
            </div>

            <div className="navbar-actions">
                <div className="navbar-user">
                    <Avatar
                        name={user?.fullName}
                        src={user?.avatar}
                        size="sm"
                    />
                    <span className="user-name">{user?.fullName}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
