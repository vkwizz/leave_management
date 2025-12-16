import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, FileText, Calendar } from 'lucide-react';

const AdminDashboard = () => {
    const [view, setView] = useState('leaves'); // leaves, users, policies
    const [stats, setStats] = useState({ users: 0, policies: 0, pendingLeaves: 0 });

    const [users, setUsers] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        try {
            if (view === 'users') {
                const res = await api.get('/users');
                setUsers(res.data);
            } else if (view === 'policies') {
                const res = await api.get('/policies');
                setPolicies(res.data);
            } else {
                const res = await api.get('/leaves/pending');
                setLeaves(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleApproveReject = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        try {
            await api.post('/users', data);
            e.target.reset();
            fetchData();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error creating user');
        }
    };

    const handleCreatePolicy = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        try {
            await api.post('/policies', data);
            e.target.reset();
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`btn ${view === 'leaves' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setView('leaves')}
                >
                    <Calendar size={18} /> Leaves
                </button>
                <button
                    className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setView('users')}
                >
                    <Users size={18} /> Users
                </button>
                <button
                    className={`btn ${view === 'policies' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setView('policies')}
                >
                    <FileText size={18} /> Policies
                </button>
            </div>

            {view === 'leaves' && (
                <div className="card">
                    <h3>All Pending Leaves</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Dates</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave._id}>
                                    <td>{leave.user?.username}</td>
                                    <td>{leave.user?.role}</td>
                                    <td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleApproveReject(leave._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Approve</button>
                                            <button onClick={() => handleApproveReject(leave._id, 'Rejected')} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {leaves.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No pending leaves</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'users' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        <h3>Existing Users</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Manager</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.username}</td>
                                        <td>{u.role}</td>
                                        <td>{u.manager ? u.manager.username : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3>Create User</h3>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-group">
                                <label>Username</label>
                                <input name="username" className="input" required />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input name="password" type="password" className="input" required />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select name="role" className="input" required>
                                    <option value="Employee">Employee</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {/* In a real app, fetching managers list for dropdown would be better */}
                            <div className="form-group">
                                <label>Manager ID (Optional)</label>
                                <input name="managerId" className="input" placeholder="Mongo ObjectID" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create</button>
                        </form>
                    </div>
                </div>
            )}

            {view === 'policies' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        <h3>Leave Policies</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Max Days</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.type}</td>
                                        <td>{p.maxDays}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline"
                                                style={{ color: 'red', border: 'none', padding: 0 }}
                                                onClick={async () => {
                                                    await api.delete(`/policies/${p._id}`);
                                                    fetchData();
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card" style={{ height: 'fit-content' }}>
                        <h3>Add Policy</h3>
                        <form onSubmit={handleCreatePolicy}>
                            <div className="form-group">
                                <label>Leave Type</label>
                                <input name="type" className="input" required placeholder="e.g. Sick Leave" />
                            </div>
                            <div className="form-group">
                                <label>Max Days</label>
                                <input name="maxDays" type="number" className="input" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Policy</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
