import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks';
import { UserService, LocalStorageService } from '../services';
import { useState, useEffect } from 'react';

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

  return user ? <Outlet /> : <Navigate to="/user/login" replace />;
}
