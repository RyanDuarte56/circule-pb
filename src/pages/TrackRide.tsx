import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MobileLayout } from '@/components/MobileLayout';
import { useRides } from '@/contexts/RidesContext';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Users,
  Star,
  Car,
  Phone,
  MessageCircle,
  MapIcon,
  Route
} from 'lucide-react';

const TrackRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { rides } = useRides();
  const [isTracking, setIsTracking] = useState(true);

  const [estimatedTime, setEstimatedTime] = useState(12);

  // Dados da carona podem vir via state ou buscar na lista
  const rideData = location.state || rides.find(r => r.id === rideId);
  
  // Se não encontrar a carona, redirecionar
  if (!rideData) {
    navigate('/rides-list');
    return null;
  }
  
  // Garantir que os dados do usuário existam
  const ride = {
    ...rideData,
    user: rideData.user || {
      name: 'Motorista',
      photo: '',
      rating: 4.5,
      occupation: 'aluno' as const
    }
  };

  // Atualizar tempo estimado
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(1, prev - 0.5));
    }, 30000); // Atualiza a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [isTracking]);



  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/rides-list" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">
            {isTracking ? 'Acompanhar Carona' : 'Detalhes da Carona'}
          </h1>
        </div>

        {/* Driver Info Card */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={ride.user.photo} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {getInitials(ride.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{ride.user.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="text-sm text-muted-foreground">{ride.user.rating}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ride.user.occupation}
                </Badge>
              </div>
              {ride.vehicle && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>{ride.vehicle}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border mb-6">
          <h3 className="font-semibold mb-4">Detalhes da Viagem</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <span className="font-medium">Horário de Saída</span>
                <p className="text-sm text-muted-foreground">{ride.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-secondary" />
              <div>
                <span className="font-medium">Origem</span>
                <p className="text-sm text-muted-foreground">{ride.departure}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-accent" />
              <div>
                <span className="font-medium">Destino</span>
                <p className="text-sm text-muted-foreground">{ride.destination}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {ride.availableSeats && (
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{ride.availableSeats} vagas</span>
                </div>
              )}
              
              {ride.shareFuel && ride.price && (
                <div className="flex items-center space-x-1 text-accent">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">R$ {ride.price}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status da Viagem */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card border mb-6">
          <h3 className="font-semibold mb-4">Status da Viagem</h3>
          
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Route className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Tempo estimado:</span>
                </div>
                <span className="text-accent font-medium">{Math.round(estimatedTime)} min</span>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Motorista confirmou a carona</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <MapPin className="w-4 h-4" />
                <span>Ponto de encontro: {ride.departure}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          <div className="space-y-2">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate('/chat/' + ride.id)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversar com Motorista
            </Button>
            <Button 
              variant="destructive"
              className="w-full"
              onClick={() => {
                if (confirm('Tem certeza que deseja cancelar esta carona?')) {
                  navigate('/rides');
                }
              }}
            >
              Cancelar Carona
            </Button>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Você receberá notificações sobre atualizações da viagem
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TrackRide;