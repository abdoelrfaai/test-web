
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { loginUser, registerUser, logoutUser, createAdminAccount } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, setUser } = useAuthState();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        setUser(userData);
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled in the loginUser function
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const userData = await registerUser(username, email, password);
      if (userData) {
        setUser(userData);
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      // Error is handled in the registerUser function
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate('/');
    } catch (error) {
      // Error is handled in the logoutUser function
    }
  };

  const handleCreateAdmin = async () => {
    try {
      const adminUser = await createAdminAccount();
      if (adminUser) {
        setUser(adminUser);
        navigate('/admin');
      }
    } catch (error) {
      // Error is handled in the createAdminAccount function
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    login,
    register,
    logout,
    createAdminAccount: handleCreateAdmin
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري التحميل...</span>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
