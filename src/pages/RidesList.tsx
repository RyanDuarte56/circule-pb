import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Users,
  MessageCircle,
  Star,
  Car
} from 'lucide-react';

// Mock data
const mockRides = [
  {
    id: '1',
    user: {
      name: 'João Santos',
      photo: '',
      rating: 4.8,
      occupation: 'aluno'
    },
    time: '18:00',
    departure: 'CI - Centro de Informática',
    destination: 'Manaíra Shopping',
    price: 5,
    availableSeats: 3,
    shareFuel: true,
    vehicle: 'Honda Civic Prata'
  },
  {
    id: '2',
    user: {
      name: 'Maria Silva',
      photo: '',
      rating: 4.9,
      occupation: 'professora'
    },
    time: '19:30',
    departure: 'CI - Centro de Informática',
    destination: 'Cabo Branco',
    price: 8,
    availableSeats: 2,
    shareFuel: true,
    vehicle: 'Toyota Corolla Branco'
  }
];

const mockRequests = [
  {
    id: '1',
    user: {
      name: 'Ana Costa',
      photo: '',
      rating: 4.7,
      occupation: 'aluna'
    },
    time: '17:00',
    departure: 'CI - Centro de Informática',
    destination: 'Bessa',
    shareFuel: true
  },
  {
    id: '2',
    user: {
      name: 'Pedro Lima',
      photo: '',
      rating: 4.6,
      occupation: 'funcionário'
    },
    time: '19:00',
    departure: 'CI - Centro de Informática',
    destination: 'Tambaú',
    shareFuel: false
  }
];

const RidesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChatClick = (rideId: string) => {
    navigate(`/chat/${rideId}`);
  };

  const ridesData = user.isDriver ? mockRequests : mockRides;
  const isDriverView = user.isDriver;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">
            {isDriverView ? 'Pedidos de Carona' : 'Caronas Disponíveis'}
          </h1>
        </div>

        {/* Filter/Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {ridesData.length} {isDriverView ? 'pedidos encontrados' : 'caronas disponíveis'}
          </p>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>

        {/* Rides List */}
        <div className="space-y-4 flex-1">
          {ridesData.map((ride) => (
            <div key={ride.id} className="bg-gradient-card rounded-xl p-4 shadow-card border">
              {/* User Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={ride.user.photo} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getInitials(ride.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{ride.user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-xs text-muted-foreground">{ride.user.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {ride.user.occupation}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm font-medium">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{ride.time}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info (só para caronas oferecidas) */}
              {!isDriverView && 'vehicle' in ride && (
                <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
                  <Car className="w-4 h-4" />
                  <span>{(ride as any).vehicle}</span>
                </div>
              )}

              {/* Route */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="font-medium">Saída:</span>
                  <span className="text-muted-foreground">{ride.departure}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Navigation className="w-4 h-4 text-accent" />
                  <span className="font-medium">Destino:</span>
                  <span className="text-muted-foreground">{ride.destination}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {!isDriverView && 'availableSeats' in ride && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{(ride as any).availableSeats} vagas</span>
                    </div>
                  )}
                  
                  {ride.shareFuel && (
                    <div className="flex items-center space-x-1 text-sm text-accent">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {!isDriverView && 'price' in ride 
                          ? `R$ ${(ride as any).price}` 
                          : 'Divide combustível'
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => handleChatClick(ride.id)}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isDriverView ? 'Responder Pedido' : 'Conversar'}
              </Button>
            </div>
          ))}
        </div>

        {/* Add Ride Button */}
        <div className="mt-6">
          <Link to={user.isDriver ? "/offer-ride" : "/request-ride"}>
            <Button variant="outline" className="w-full">
              {user.isDriver ? 'Oferecer Nova Carona' : 'Pedir Nova Carona'}
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RidesList;