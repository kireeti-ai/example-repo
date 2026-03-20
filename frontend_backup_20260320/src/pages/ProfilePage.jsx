import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Avatar from '../components/common/Avatar';
import './ProfilePage.css';

function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ firstName: user?.firstName, lastName: user?.lastName });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            updateUser(form);
            setEditing(false);
            setMessage('Profile updated');
        } catch (error) {
            setMessage('Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage('Password changed successfully');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="profile-page animate-fade-in">
            <h1>Profile</h1>
            {message && <div className="message">{message}</div>}
            <div className="profile-card">
                <Avatar name={user?.fullName} size="lg" />
                <div className="profile-info">
                    {!editing ? (
                        <>
                            <h2>{user?.fullName}</h2>
                            <p>{user?.email}</p>
                            <span className="badge badge-primary">{user?.role}</span>
                            <button className="btn btn-secondary mt-4" onClick={() => setEditing(true)}>Edit Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleProfileUpdate}>
                            <input className="form-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                            <input className="form-input mt-2" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                            <div className="mt-4">
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <div className="profile-card mt-6">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                    <input type="password" className="form-input" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                    <input type="password" className="form-input mt-2" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                    <input type="password" className="form-input mt-2" placeholder="Confirm password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                    <button type="submit" className="btn btn-primary mt-4">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
