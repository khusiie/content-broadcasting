import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    if (data.user.role === 'principal') {
      navigate('/principal');
    } else {
      navigate('/teacher');
    }
    return data;
  }, [navigate]);
  const register = useCallback(async (name, email, password, role) => {
    const data = await authService.register(name, email, password, role);
    return data;
  }, []);
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/');
  }, [navigate]);
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'teacher',
    isPrincipal: user?.role === 'principal',
  }), [user, loading, login, register, logout]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
