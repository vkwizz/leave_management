import { useState, useEffect } from 'react';
import api from '../../api/axios';

export const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves/my-leaves');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card">
            <h3>My Leave History</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map(l => (
                        <tr key={l._id}>
                            <td>{l.type}</td>
                            <td>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                            <td>{l.reason}</td>
                            <td>
                                <span className={`badge badge-${l.status.toLowerCase()}`}>
                                    {l.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {leaves.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No records found</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export const ApplyLeave = ({ onSuccess }) => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        api.get('/policies').then(res => setPolicies(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        try {
            await api.post('/leaves', data);
            alert('Leave application submitted!');
            e.target.reset();
            if (onSuccess) onSuccess();
        } catch (err) {
            alert('Error applying for leave');
        }
    };

    return (
        <div className="card">
            <h3>Apply for Leave</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Leave Type</label>
                    <select name="type" className="input" required>
                        <option value="">Select Type</option>
                        {policies.map(p => (
                            <option key={p._id} value={p.type}>{p.type} (Max: {p.maxDays} days)</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input name="startDate" type="date" className="input" required />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input name="endDate" type="date" className="input" required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Reason</label>
                    <textarea name="reason" className="input" rows="3" required></textarea>
                </div>
                <button className="btn btn-primary">Submit Request</button>
            </form>
        </div>
    );
};
