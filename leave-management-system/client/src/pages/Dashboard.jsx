import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import EmployeeDashboard from './employee/EmployeeDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="layout" style={{ flexDirection: 'column' }}>
            <Navbar />
            <div className="content">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {user.role === 'Admin' && <AdminDashboard />}
                    {user.role === 'Manager' && <ManagerDashboard />}
                    {user.role === 'Employee' && <EmployeeDashboard />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
