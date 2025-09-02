import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Flag,
  Car,
  Users,
  Star
} from 'lucide-react';

const Profile = () => {
  const { user, toggleDriverMode } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  if (!user) return null;

  const handleToggleDriverMode = () => {
    try {
      setError('');
      toggleDriverMode();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao alternar perfil.');
    }
  };

  const canToggleProfile = user.hasDriverProfile && user.hasPassengerProfile;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getOccupationIcon = (occupation: string) => {
    switch (occupation) {
      case 'aluno':
        return <GraduationCap className="w-4 h-4" />;
      case 'professor':
        return <User className="w-4 h-4" />;
      case 'funcionario':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getOccupationLabel = (occupation: string) => {
    switch (occupation) {
      case 'aluno':
        return 'Aluno';
      case 'professor':
        return 'Professor';
      case 'funcionario':
        return 'Funcionário';
      default:
        return 'Usuário';
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/menu" className="p-2 -ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold ml-4">Perfil</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Photo & Basic Info */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4 shadow-card">
            <AvatarImage src={user.photo} />
            <AvatarFallback className="bg-gradient-primary text-white text-xl font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-muted-foreground mb-4">
            {getOccupationLabel(user.occupation)} • CI/UFPB
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 w-full max-w-sm">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Driver Toggle */}
          <div className="flex items-center space-x-3 bg-gradient-card rounded-full px-4 py-2 shadow-card border">
            <div className="flex items-center space-x-2">
              {user.isDriver ? <Car className="w-4 h-4 text-primary" /> : <Users className="w-4 h-4 text-secondary" />}
              <span className="text-sm font-medium">
                {user.isDriver ? 'Motorista' : 'Passageiro'}
              </span>
            </div>
            {canToggleProfile && (
              <Switch
                checked={user.isDriver}
                onCheckedChange={handleToggleDriverMode}
              />
            )}
          </div>
          
          {!canToggleProfile && (
            <div className="text-center mt-2">
              <p className="text-xs text-muted-foreground mb-3 max-w-sm">
                {user.hasDriverProfile || user.hasPassengerProfile 
                  ? 'Você só tem um tipo de perfil criado'
                  : 'Crie perfis adicionais para alternar entre eles'
                }
              </p>
              
              {user.hasPassengerProfile && !user.hasDriverProfile && (
                <Button 
                  onClick={() => navigate('/driver-setup')}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm px-4 py-2"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Criar Conta de Motorista
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <h3 className="font-semibold mb-4 text-gradient">Informações Pessoais</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Idade</p>
                  <p className="text-sm text-muted-foreground">{user.age} anos</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getOccupationIcon(user.occupation)}
                <div>
                  <p className="text-sm font-medium">Ocupação</p>
                  <p className="text-sm text-muted-foreground">
                    {getOccupationLabel(user.occupation)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Centro</p>
                  <p className="text-sm text-muted-foreground">CI - Centro de Informática</p>
                </div>
              </div>

              {user.nationality && (
                <div className="flex items-center space-x-3">
                  <Flag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nacionalidade</p>
                    <p className="text-sm text-muted-foreground">{user.nationality}</p>
                  </div>
                </div>
              )}

              {user.city && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cidade</p>
                    <p className="text-sm text-muted-foreground">{user.city}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border text-center">
              <Car className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Caronas realizadas</p>
            </div>

            <Link to="/user-ratings" className="block">
              <div className="bg-gradient-card rounded-xl p-4 shadow-card border text-center hover:shadow-glow transition-all duration-300">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Minhas avaliações</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Button variant="outline" className="w-full">
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Profile;