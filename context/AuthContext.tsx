import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { 
  verifyCredentials, 
  registerUserInDB, 
  saveSession, 
  getSession, 
  clearSession,
  updateUserInDB,
  updateUserPassword,
  getUserProfileImage
} from '../services/storage';

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore session on load
    const loadUser = async () => {
      const storedUser = getSession();
      if (storedUser) {
        // Hydrate image from IndexedDB
        const pfpUrl = await getUserProfileImage(storedUser.email);
        setUser({ ...storedUser, profilePicture: pfpUrl });
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validUser = verifyCredentials(email, password);
    // Load image immediately
    const pfpUrl = await getUserProfileImage(validUser.email);
    const fullUser = { ...validUser, profilePicture: pfpUrl };
    
    setUser(fullUser);
    saveSession(fullUser);
  };

  const signup = async (email: string, name: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser = registerUserInDB(email, name, password);
    // New user won't have an image usually, unless logic changes
    setUser(newUser);
    saveSession(newUser);
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const updateProfile = async (name: string, profilePicture?: File) => {
     if (!user) return;
     const updatedUser = await updateUserInDB(user.email, name, profilePicture);
     setUser(updatedUser);
     saveSession(updatedUser);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
     if (!user) return;
     await updateUserPassword(user.email, oldPassword, newPassword);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};