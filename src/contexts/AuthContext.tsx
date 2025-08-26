import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  occupation: 'aluno' | 'professor' | 'funcionario';
  isDriver: boolean;
  photo?: string;
  city?: string;
  nationality?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isDriver?: boolean) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => void;
  toggleDriverMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, isDriver = false) => {
    // Mock login - em produção seria uma API call
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email,
      phone: '(83) 99999-9999',
      age: 22,
      occupation: 'aluno',
      isDriver,
      photo: '',
      city: 'João Pessoa',
      nationality: 'Brasileiro'
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUser(newUser);
  };

  const toggleDriverMode = () => {
    if (user) {
      setUser({ ...user, isDriver: !user.isDriver });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, toggleDriverMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};