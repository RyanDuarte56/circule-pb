import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  occupation: 'aluno' | 'professor' | 'funcionario' | 'terceirizado';
  isDriver: boolean;
  photo?: string;
  city?: string;
  nationality?: string;
  document?: File | null;
  needsValidation?: boolean;
  isValidated?: boolean;
  validationStatus?: 'pending' | 'approved' | 'rejected';
  hasDriverProfile?: boolean;
  hasPassengerProfile?: boolean;
  vehicleData?: {
    brand: string;
    model: string;
    year: string;
    plate: string;
    color: string;
  };
  cnhDocument?: string;
  crlvDocument?: string;
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

  // Carregar usuário logado do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Migração: adicionar campos de perfil se não existirem
      if (userData.hasDriverProfile === undefined || userData.hasPassengerProfile === undefined) {
        userData.hasDriverProfile = userData.isDriver;
        userData.hasPassengerProfile = !userData.isDriver;
        
        // Atualizar no localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Atualizar também na lista de usuários registrados
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = users.map((u: User) => {
          if (u.id === userData.id) {
            return {
              ...u,
              hasDriverProfile: u.hasDriverProfile ?? u.isDriver,
              hasPassengerProfile: u.hasPassengerProfile ?? !u.isDriver
            };
          }
          return u;
        });
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      }
      
      setUser(userData);
    }
  }, []);

  const login = (email: string, password: string, isDriver = false) => {
    // Buscar usuários cadastrados no localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (!foundUser) {
      throw new Error('Usuário não encontrado. Verifique o email ou cadastre-se.');
    }
    
    // Verificar senha (em produção seria hash)
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    if (userPasswords[foundUser.id] !== password) {
      throw new Error('Senha incorreta.');
    }
    
    // Verificar se terceirizado foi validado
    if (foundUser.occupation === 'terceirizado' && foundUser.validationStatus !== 'approved') {
      throw new Error('Sua conta ainda está pendente de validação. Aguarde a aprovação.');
    }
    
    // Atualizar tipo de usuário se especificado
    if (isDriver !== undefined) {
      foundUser.isDriver = isDriver;
      
      // Marcar qual perfil foi criado/acessado
      if (isDriver) {
        foundUser.hasDriverProfile = true;
      } else {
        foundUser.hasPassengerProfile = true;
      }
      
      // Atualizar no localStorage
      const updatedUsers = users.map((u: User) => u.id === foundUser.id ? foundUser : u);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
    
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData: Omit<User, 'id'> & { password: string }) => {
    // Verificar se email já existe
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const emailExists = users.some((u: User) => u.email === userData.email);
    
    if (emailExists) {
      throw new Error('Este email já está cadastrado.');
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      isValidated: userData.occupation !== 'terceirizado',
      validationStatus: userData.occupation === 'terceirizado' ? 'pending' : 'approved',
      photo: '',
      city: 'João Pessoa',
      nationality: 'Brasileiro'
    };
    
    // Salvar usuário na lista de usuários registrados
    const updatedUsers = [...users, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Salvar senha separadamente (em produção seria hash)
    const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    passwords[newUser.id] = userData.password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));
    
    // Simular envio do documento para terceirizados
    if (userData.occupation === 'terceirizado' && userData.document) {
      console.log('Documento enviado para validação:', userData.document.name);
      // Em produção, aqui seria feito o upload do documento para o servidor
    }
    
    return newUser;
  };

  const toggleDriverMode = () => {
    if (user) {
      const newDriverMode = !user.isDriver;
      
      // Verificar se o usuário pode alternar para o tipo solicitado
      if (newDriverMode && !user.hasDriverProfile) {
        throw new Error('Você precisa criar um perfil de motorista primeiro.');
      }
      
      if (!newDriverMode && !user.hasPassengerProfile) {
        throw new Error('Você precisa criar um perfil de passageiro primeiro.');
      }
      
      const updatedUser = { ...user, isDriver: newDriverMode };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Atualizar também na lista de usuários registrados
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
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