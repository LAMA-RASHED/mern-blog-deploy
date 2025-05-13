import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PrivateRouter() {
  const currentUser = localStorage.getItem('user') || false;

  if (!currentUser) {
    toast.warning('You need to login first');
    return <Navigate to="/auth/login" replace />;
  } else {
    return <Outlet />;
  }
}
