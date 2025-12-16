import { useState } from 'react';
import { ApplyLeave, MyLeaves } from '../common/LeaveComponents';

const EmployeeDashboard = () => {
    // Determine strict mode for re-fetching or just using local state? 
    // For simplicity, we can pass a callback key to force refresh
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div key={refreshKey}>
                <MyLeaves />
            </div>
            <div>
                <ApplyLeave onSuccess={() => setRefreshKey(prev => prev + 1)} />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
