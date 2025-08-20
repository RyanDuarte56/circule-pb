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

        {/* Main Menu List */}
        <div className="space-y-4 flex-1">
          {/* Listar Caronas */}
          <Link to="/rides" className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <List className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Listar Caronas</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.isDriver ? 'Ver pedidos de carona' : 'Encontrar caronas disponíveis'}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Oferecer/Pedir Carona */}
          <Link to={user.isDriver ? "/offer-ride" : "/request-ride"} className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Plus className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {user.isDriver ? 'Oferecer Carona' : 'Pedir Carona'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.isDriver ? 'Disponibilizar vagas no seu carro' : 'Solicitar uma carona'}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Perfil */}
          <Link to="/profile" className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Perfil</h3>
                  <p className="text-sm text-muted-foreground">Visualizar e editar meus dados</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Configurações */}
          <Link to="/settings" className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center group-hover:bg-muted/30 transition-colors">
                  <Settings className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Configurações</h3>
                  <p className="text-sm text-muted-foreground">Ajustes e preferências do app</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Ajuda */}
          <Link to="/help" className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Ajuda</h3>
                  <p className="text-sm text-muted-foreground">Central de suporte e FAQ</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Sair */}
          <button onClick={handleLogout} className="group block w-full">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                  <LogOut className="w-6 h-6 text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-base mb-1">Sair</h3>
                  <p className="text-sm text-muted-foreground">Fazer logout da conta</p>
                </div>
              </div>
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