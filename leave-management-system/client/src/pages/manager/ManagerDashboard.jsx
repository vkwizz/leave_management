import { useState, useEffect } from 'react';
import { ApplyLeave, MyLeaves } from '../common/LeaveComponents';
import api from '../../api/axios';

const ManagerDashboard = () => {
    const [view, setView] = useState('team'); // team, personal
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchTeamLeaves();
    }, [view]);

    const fetchTeamLeaves = async () => {
        try {
            const res = await api.get('/leaves/pending');
            setPendingLeaves(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            fetchTeamLeaves();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error processing request');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${view === 'team' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setView('team')}
                    >
                        Team Approvals
                    </button>
                    <button
                        className={`btn ${view === 'personal' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setView('personal')}
                    >
                        My Leaves
                    </button>
                </div>
            </div>

            {view === 'team' && (
                <div className="card">
                    <h3>Team Pending Requests</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Dates</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingLeaves.map(l => (
                                <tr key={l._id}>
                                    <td>{l.user?.username}</td>
                                    <td>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                                    <td>{l.reason}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleAction(l._id, 'Approved')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Approve</button>
                                            <button onClick={() => handleAction(l._id, 'Rejected')} className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pendingLeaves.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No pending requests</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'personal' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div key={refreshKey}>
                        <MyLeaves />
                    </div>
                    <div>
                        <ApplyLeave onSuccess={() => setRefreshKey(prev => prev + 1)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
