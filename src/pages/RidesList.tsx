import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRides } from '@/contexts/RidesContext';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Users,
  MessageCircle,
  Star,
  Car,
  Filter,
  Route,
  MapIcon
} from 'lucide-react';

const RidesList = () => {
  const { user } = useAuth();
  const { rides, requests } = useRides();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');
  const [showMap, setShowMap] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChatClick = (rideId: string) => {
    navigate(`/chat/${rideId}`);
  };

  const ridesData = user.isDriver ? requests : rides;
  const isDriverView = user.isDriver;

  const filteredRides = ridesData.filter(ride => {
    if (filterType === 'all') return true;
    if (filterType === 'favorite' && isDriverView) {
      // Simular trajeto favorito: CI → Manaíra
      return ride.departure.includes('CI') && ride.destination.includes('Manaíra');
    }
    if (filterType === 'proximity' && isDriverView) {
      // Ordenar por proximidade (simulado)
      return true;
    }
    return true;
  });

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
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredRides.length} {isDriverView ? 'pedidos encontrados' : 'caronas disponíveis'}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              {showMap ? 'Lista' : 'Mapa'}
            </Button>
          </div>

          {/* Filters for Driver */}
          {isDriverView && (
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar pedidos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pedidos</SelectItem>
                  <SelectItem value="favorite">Trajeto favorito</SelectItem>
                  <SelectItem value="proximity">Por proximidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Map View (placeholder) */}
          {showMap && (
            <div className="bg-gradient-card rounded-xl p-6 shadow-card border">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                <Route className="w-5 h-5" />
                <span className="font-medium">Mapa da Rota</span>
              </div>
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Visualização do mapa em desenvolvimento
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rota: CI → Manaíra Shopping via BR-230
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rides List */}
        <div className="space-y-4 flex-1">
          {filteredRides.map((ride) => (
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
                  
                  {isDriverView && 'requestedSeats' in ride && (
                    <div className="flex items-center space-x-1 text-sm bg-accent/10 px-2 py-1 rounded-md">
                      <Users className="w-4 h-4 text-accent" />
                      <span className="font-medium text-accent">
                        {(ride as any).requestedSeats} {(ride as any).requestedSeats === 1 ? 'vaga' : 'vagas'}
                      </span>
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