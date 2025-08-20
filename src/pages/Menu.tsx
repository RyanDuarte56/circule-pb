import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  List, 
  Plus, 
  User, 
  HelpCircle, 
  Settings,
  Car,
  Users,
  LogOut
} from 'lucide-react';
import circularLogo from '@/assets/circular-logo.png';

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={circularLogo} alt="Circular" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-gradient">Circular</h1>
          </div>
          <h2 className="text-xl font-bold mb-2">
            Olá, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            {user.occupation === 'aluno' ? 'Estudante' : 
             user.occupation === 'professor' ? 'Professor' : 'Funcionário'} do CI/UFPB
          </p>
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Listar Caronas */}
          <Link to="/rides" className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <List className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Listar Caronas</h3>
              <p className="text-sm text-muted-foreground">
                {user.isDriver ? 'Ver pedidos' : 'Encontrar caronas'}
              </p>
            </div>
          </Link>

          {/* Oferecer/Pedir Carona */}
          <Link to={user.isDriver ? "/offer-ride" : "/request-ride"} className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Plus className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {user.isDriver ? 'Oferecer Carona' : 'Pedir Carona'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user.isDriver ? 'Disponibilizar vagas' : 'Solicitar carona'}
              </p>
            </div>
          </Link>

          {/* Perfil */}
          <Link to="/profile" className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <User className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Perfil</h3>
              <p className="text-sm text-muted-foreground">Meus dados</p>
            </div>
          </Link>

          {/* Configurações */}
          <Link to="/settings" className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-muted/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-muted/30 transition-colors">
                <Settings className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Configurações</h3>
              <p className="text-sm text-muted-foreground">Ajustes do app</p>
            </div>
          </Link>

          {/* Ajuda */}
          <Link to="/help" className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <HelpCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Ajuda</h3>
              <p className="text-sm text-muted-foreground">Suporte</p>
            </div>
          </Link>

          {/* Sair */}
          <button onClick={handleLogout} className="group">
            <div className="bg-gradient-card rounded-2xl p-6 shadow-card border hover:shadow-glow transition-all duration-300 h-full flex flex-col items-center justify-center text-center group-hover:scale-105">
              <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <LogOut className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sair</h3>
              <p className="text-sm text-muted-foreground">Fazer logout</p>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-card rounded-2xl p-6 shadow-card border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Caronas</span>
            </div>
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </div>

          <div className="bg-gradient-card rounded-2xl p-6 shadow-card border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-medium">Pessoas</span>
            </div>
            <p className="text-3xl font-bold mb-1">28</p>
            <p className="text-sm text-muted-foreground">Conectadas</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Menu;