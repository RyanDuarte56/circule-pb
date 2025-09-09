import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  occupation: 'aluno' | 'professor' | 'funcionario' | 'terceirizado';
  photo?: string;
  city?: string;
  nationality?: string;
  document?: string | null; // Apenas o nome do arquivo
  needsValidation?: boolean;
  isValidated?: boolean;
  validationStatus?: 'pending' | 'approved' | 'rejected';
}

export interface DriverProfile {
  vehicleData: {
    brand: string;
    model: string;
    year: string;
    plate: string;
    color: string;
  };
  cnhDocument?: string; // Nome do arquivo
  crlvDocument?: string; // Nome do arquivo
}

export interface PassengerProfile {
  favoriteRoutes?: string[]; // IDs das rotas favoritas
}

export interface User extends UserProfile {
  isDriver: boolean; // Indica qual perfil está ativo no momento
  hasDriverProfile: boolean; // Indica se o usuário possui perfil de motorista
  hasPassengerProfile: boolean; // Indica se o usuário possui perfil de passageiro
  driverProfile?: DriverProfile; // Dados do perfil de motorista, se existir
  passengerProfile?: PassengerProfile; // Dados do perfil de passageiro, se existir
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isDriver?: boolean) => void;
  logout: () => void;
  register: (userData: Omit<UserProfile, 'id'> & { password: string }) => void;
  toggleDriverMode: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Carregar usuário logado do localStorage na inicialização
  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      // Carregar dados do usuário específico
      const userProfileData = localStorage.getItem(`user_${currentUserId}`);
      
      if (userProfileData) {
        const userProfile = JSON.parse(userProfileData);
        
        // Carregar perfis específicos se existirem
        const driverProfileData = localStorage.getItem(`driver_${currentUserId}`);
        const passengerProfileData = localStorage.getItem(`passenger_${currentUserId}`);
        
        // Construir objeto de usuário completo
        const userData: User = {
          ...userProfile,
          hasDriverProfile: !!driverProfileData,
          hasPassengerProfile: !!passengerProfileData,
          isDriver: localStorage.getItem(`activeProfile_${currentUserId}`) === 'driver',
          driverProfile: driverProfileData ? JSON.parse(driverProfileData) : undefined,
          passengerProfile: passengerProfileData ? JSON.parse(passengerProfileData) : undefined
        };
        
        setUser(userData);
      }
    }
  }, []);

  const login = (email: string, password: string, isDriver = false) => {
    // Buscar usuários cadastrados no localStorage
    const userEmails = JSON.parse(localStorage.getItem('userEmails') || '{}');
    const userId = userEmails[email];
    
    if (!userId) {
      throw new Error('Usuário não encontrado. Verifique o email ou cadastre-se.');
    }
    
    // Carregar dados do perfil do usuário
    const userProfileData = localStorage.getItem(`user_${userId}`);
    if (!userProfileData) {
      throw new Error('Dados do usuário não encontrados.');
    }
    
    const userProfile: UserProfile = JSON.parse(userProfileData);
    
    // Verificar senha (em produção seria hash)
    const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    if (userPasswords[userId] !== password) {
      throw new Error('Senha incorreta.');
    }
    
    // Verificar se terceirizado foi validado
    if (userProfile.occupation === 'terceirizado' && userProfile.validationStatus !== 'approved') {
      throw new Error('Sua conta ainda está pendente de validação. Aguarde a aprovação.');
    }
    
    // Carregar perfis específicos
    const driverProfileData = localStorage.getItem(`driver_${userId}`);
    const passengerProfileData = localStorage.getItem(`passenger_${userId}`);
    
    // Verificar se o usuário tem o perfil solicitado
    const hasDriverProfile = !!driverProfileData;
    const hasPassengerProfile = !!passengerProfileData || !hasDriverProfile; // Se não tem nenhum perfil, assume que é passageiro
    
    // Verificar se pode fazer login com o tipo solicitado
    if (isDriver && !hasDriverProfile) {
      throw new Error('Você não possui um perfil de motorista. Crie um perfil de motorista primeiro.');
    }
    
    // Atualizar perfil ativo
    localStorage.setItem(`activeProfile_${userId}`, isDriver ? 'driver' : 'passenger');
    
    // Construir objeto de usuário completo
    const userData: User = {
      ...userProfile,
      isDriver,
      hasDriverProfile,
      hasPassengerProfile,
      driverProfile: driverProfileData ? JSON.parse(driverProfileData) : undefined,
      passengerProfile: passengerProfileData ? JSON.parse(passengerProfileData) : undefined
    };
    
    // Salvar ID do usuário atual
    localStorage.setItem('currentUserId', userId);
    
    // Garantir que o objeto de usuário no localStorage esteja atualizado com as flags corretas
    localStorage.setItem(`user_${userId}`, JSON.stringify({
      ...userProfile,
      hasDriverProfile,
      hasPassengerProfile
    }));
    
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const register = (userData: Omit<UserProfile, 'id'> & { password: string }) => {
    // Verificar se email já existe
    const userEmails = JSON.parse(localStorage.getItem('userEmails') || '{}');
    
    if (userEmails[userData.email]) {
      throw new Error('Este email já está cadastrado.');
    }
    
    // Criar ID único para o usuário
    const userId = Date.now().toString();
    
    // Criar perfil básico do usuário
    const userProfile: UserProfile = {
      ...userData,
      id: userId,
      isValidated: userData.occupation !== 'terceirizado',
      validationStatus: userData.occupation === 'terceirizado' ? 'pending' : 'approved',
      photo: '',
      city: 'João Pessoa',
      nationality: 'Brasileiro',
      document: userData.document ? (userData.document as any).name : null // Salvar apenas o nome do arquivo
    };
    
    // Criar perfil de passageiro por padrão
    const passengerProfile: PassengerProfile = {
      favoriteRoutes: []
    };
    localStorage.setItem(`passenger_${userId}`, JSON.stringify(passengerProfile));
    
    // Construir objeto de usuário completo
    const newUser: User = {
      ...userProfile,
      isDriver: false,
      hasDriverProfile: false,
      hasPassengerProfile: true,
      passengerProfile
    };
    
    // Salvar perfil do usuário com as flags de perfil
    localStorage.setItem(`user_${userId}`, JSON.stringify({
      ...userProfile,
      hasDriverProfile: false,
      hasPassengerProfile: true
    }));
    
    // Mapear email para ID do usuário
    userEmails[userData.email] = userId;
    localStorage.setItem('userEmails', JSON.stringify(userEmails));
    
    // Salvar senha separadamente (em produção seria hash)
    const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    passwords[userId] = userData.password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));
    
    // Simular envio do documento para terceirizados
    if (userData.occupation === 'terceirizado' && userData.document) {
      console.log('Documento enviado para validação:', (userData.document as any).name);
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
      
      // Atualizar perfil ativo no localStorage
      localStorage.setItem(`activeProfile_${user.id}`, newDriverMode ? 'driver' : 'passenger');
      
      // Recarregar os perfis específicos para garantir que temos os dados mais recentes
      const driverProfileData = localStorage.getItem(`driver_${user.id}`);
      const passengerProfileData = localStorage.getItem(`passenger_${user.id}`);
      
      // Atualizar estado local
      const updatedUser = { 
        ...user, 
        isDriver: newDriverMode,
        hasDriverProfile: !!driverProfileData,
        hasPassengerProfile: !!passengerProfileData,
        driverProfile: driverProfileData ? JSON.parse(driverProfileData) : undefined,
        passengerProfile: passengerProfileData ? JSON.parse(passengerProfileData) : undefined
      };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, toggleDriverMode, setUser }}>
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