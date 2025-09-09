import React, { useEffect, useState } from 'react';
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
  LogOut,
  Star,
  Bell,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import circularLogo from '@/assets/circular-logo.png';

// Componente de Notificação com Sino
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'accept', message: 'Sua corrida foi aceita!', time: '2 min atrás', read: false },
    { id: 2, type: 'cancel', message: 'Uma corrida foi cancelada.', time: '5 min atrás', read: false },
    { id: 3, type: 'similar', message: 'Há um pedido de corrida similar à sua rota desejada.', time: '10 min atrás', read: false },
    { id: 4, type: 'request', message: 'Novo pedido de corrida disponível.', time: '15 min atrás', read: false },
    { id: 5, type: 'offer', message: 'Nova corrida oferecida disponível.', time: '20 min atrás', read: false }
  ]);
  
  // Atualiza o estado do diálogo
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  
  // Marca uma notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Marca todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Limpa todas as notificações
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Conta notificações não lidas
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Função para obter o ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'accept':
        return <div className="bg-green-100 p-2 rounded-full"><Car className="h-4 w-4 text-green-600" /></div>;
      case 'cancel':
        return <div className="bg-red-100 p-2 rounded-full"><X className="h-4 w-4 text-red-600" /></div>;
      case 'similar':
        return <div className="bg-blue-100 p-2 rounded-full"><Users className="h-4 w-4 text-blue-600" /></div>;
      case 'request':
        return <div className="bg-amber-100 p-2 rounded-full"><User className="h-4 w-4 text-amber-600" /></div>;
      case 'offer':
        return <div className="bg-purple-100 p-2 rounded-full"><Car className="h-4 w-4 text-purple-600" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><Bell className="h-4 w-4 text-gray-600" /></div>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <div className="relative">
            <div className="bg-primary/10 p-2 rounded-full hover:bg-primary/20 transition-colors">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
             <DialogTitle className="text-center text-xl font-bold">Notificações</DialogTitle>
             {notifications.length > 0 && (
               <div className="flex justify-between mt-2">
                 <button 
                   onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                   className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                 >
                   Marcar todas como lidas
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); clearAllNotifications(); }}
                   className="text-xs text-red-500 hover:text-red-700 transition-colors"
                 >
                   Limpar todas
                 </button>
               </div>
             )}
           </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${notification.read ? 'bg-muted/5 opacity-70' : 'bg-muted/10 hover:bg-muted/20'}`}
                onClick={() => markAsRead(notification.id)}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${notification.read ? '' : 'font-semibold'}`}>{notification.message}</p>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                Nenhuma notificação disponível
              </div>
            )}
          </div>
        </DialogContent>
    </Dialog>
  );
};

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center relative mb-4">
            <div className="flex items-center space-x-3">
              <img src={circularLogo} alt="Circular" className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-gradient">Circular</h1>
            </div>
            <div className="absolute right-0">
              <NotificationBell />
            </div>
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
                  <h3 className="font-semibold text-base mb-1">Listar Corridas</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.isDriver ? 'Ver pedidos de corrida' : 'Encontrar corridas disponíveis'}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Oferecer/Pedir Corrida */}
          <Link to={user.isDriver ? "/offer-ride" : "/request-ride"} className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Plus className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">
                    {user.isDriver ? 'Oferecer Corrida' : 'Pedir Corrida'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.isDriver ? 'Disponibilizar vagas no seu carro' : 'Solicitar uma corrida'}
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

          {/* Rotas Favoritas */}
          <Link to="/favorite-routes" className="group block">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Rotas Favoritas</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar suas rotas mais utilizadas</p>
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