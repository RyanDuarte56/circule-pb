import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu as MenuIcon, 
  List, 
  Plus, 
  User, 
  HelpCircle, 
  Settings,
  Car,
  Users,
  LogOut
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img src={circularLogo} alt="Circular" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-gradient">Circular</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link to="/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                <Link to="/help" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                  <HelpCircle className="w-5 h-5" />
                  <span>Ajuda</span>
                </Link>
                <Link to="/settings" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-left w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Olá, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            {user.occupation === 'aluno' ? 'Estudante' : 
             user.occupation === 'professor' ? 'Professor' : 'Funcionário'} do CI/UFPB
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex-1 space-y-4">
          <Link to="/rides">
            <Button className="w-full h-16 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-left">
              <div className="flex items-center space-x-4">
                <List className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Listar Caronas</div>
                  <div className="text-sm opacity-90">
                    {user.isDriver ? 'Ver pedidos de carona' : 'Encontrar caronas disponíveis'}
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link to={user.isDriver ? "/offer-ride" : "/request-ride"}>
            <Button className="w-full h-16 bg-gradient-hero hover:shadow-glow transition-all duration-300 text-left">
              <div className="flex items-center space-x-4">
                <Plus className="w-6 h-6" />
                <div>
                  <div className="font-semibold">
                    {user.isDriver ? 'Oferecer Carona' : 'Pedir Carona'}
                  </div>
                  <div className="text-sm opacity-90">
                    {user.isDriver ? 'Disponibilizar vagas no seu carro' : 'Solicitar uma carona'}
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Caronas</span>
            </div>
            <p className="text-2xl font-bold mt-1">12</p>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Pessoas</span>
            </div>
            <p className="text-2xl font-bold mt-1">28</p>
            <p className="text-xs text-muted-foreground">Conectadas</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Menu;