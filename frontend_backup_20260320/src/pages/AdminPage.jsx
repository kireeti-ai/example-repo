import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Avatar from '../components/common/Avatar';
import './AdminPage.css';

function AdminPage() {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);







    //afwe
    useEffect(() => {
        if (isAdmin) loadUsers();
    }, [isAdmin]);

    const loadUsers = async () => {
        try {
            const response = await userService.getUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return <Navigate to="/dashboard" replace />;
    if (loading) return <div className="admin-loading"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="admin-page animate-fade-in">
            <h1>Admin Panel</h1>
            <div className="admin-card">
                <h2>User Management</h2>
                <table className="users-table">
                    <thead>
                        <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td><div className="user-cell"><Avatar name={user.fullName} size="sm" />{user.fullName}</div></td>
                                <td>{user.email}</td>
                                <td><span className={`badge badge-${user.role === 'admin' ? 'primary' : 'gray'}`}>{user.role}</span></td>
                                <td><span className={`badge badge-${user.isActive ? 'success' : 'error'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;
