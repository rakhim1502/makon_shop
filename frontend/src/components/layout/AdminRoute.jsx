import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    try {
        const user = JSON.parse(userStr);
        if (user?.role !== 'admin') {
            return <Navigate to="/admin/login" replace />;
        }
    } catch {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;