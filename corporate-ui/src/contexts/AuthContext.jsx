import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, validateToken, logoutUser } from '../apis/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Try to validate the token
          const validationResult = await validateToken();
          
          if (validationResult.success) {
            // Token is valid, set user
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response.success) {
        const userData = response.data.data.user;
        setUser(userData);
        navigate('/home');
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await registerUser(userData);
      if (response.success) {
        const userInfo = response.data.data.user;
        setUser(userInfo);
        navigate('/home');
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear user state
      setUser(null);
      navigate('/');
    }
  };

  // Check if user is authenticated and redirect if needed
  const checkAuthAndRedirect = async (redirectTo = '/home') => {
    if (user) {
      // User is already authenticated, redirect
      navigate(redirectTo);
      return true;
    }

    // Check if there's a stored user and validate token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const validationResult = await validateToken();
        if (validationResult.success) {
          setUser(JSON.parse(storedUser));
          navigate(redirectTo);
          return true;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
      }
    }

    // No valid authentication, redirect to login
    navigate('/login');
    return false;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuthAndRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 