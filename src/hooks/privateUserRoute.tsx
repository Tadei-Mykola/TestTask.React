import { Navigate, Outlet } from 'react-router-dom';
import { StatusProvider, useUser } from '../hooks';
import { UserService, LocalStorageService } from '../services';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const userService = new UserService();
const localStorageService = new LocalStorageService();

export function PrivateUserRoute() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const accessToken = localStorageService.getAccessToken();

  useEffect(() => {
    const checkUser = async () => {
      if (accessToken && !user) {
          const userData = await userService.getUserData();
          setUser(userData);
      }
      setLoading(false);
    };

    checkUser();
  }, [accessToken, user, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <LocalizationProvider dateAdapter={AdapterDayjs}><StatusProvider><Outlet /></StatusProvider></LocalizationProvider> : <Navigate to="/user/login" replace />;
}
