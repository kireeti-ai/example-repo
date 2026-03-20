import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/tasks', icon: '✅', label: 'My Tasks' },
    { path: '/profile', icon: '👤', label: 'Profile' },
];

const adminItems = [
    { path: '/admin', icon: '⚙️', label: 'Admin' },
];

function Sidebar() {
    const { isAdmin } = useAuth();

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}

                    {isAdmin && (
                        <>
                            <li className="nav-divider"></li>
                            {adminItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
