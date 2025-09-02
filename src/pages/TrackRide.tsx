import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  const { rides } = useRides();
  const [isTracking, setIsTracking] = useState(false);

  const ride = rides.find(r => r.id === rideId);

  if (!ride) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-semibold mb-4">Carona não encontrada</h2>
          <Link to="/rides-list">
            <Button>Voltar às Caronas</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

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

        {/* Map Section */}
        {isTracking && (
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Localização em Tempo Real</h3>
              <div className="flex items-center space-x-2 text-sm text-accent">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span>Ao vivo</span>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <MapIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="font-medium mb-2">Mapa Interativo</p>
                <p className="text-sm text-muted-foreground">
                  Acompanhe a localização do motorista em tempo real
                </p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Motorista</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span>Você</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm">
                <Route className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Tempo estimado:</span>
                <span className="text-accent font-medium">12 min</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-3">
          {!isTracking ? (
            <Button 
              onClick={handleStartTracking}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Acompanhar Corrida
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setIsTracking(false)}
              >
                Parar Acompanhamento
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
              >
                Cancelar Carona
              </Button>
            </div>
          )}
          
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