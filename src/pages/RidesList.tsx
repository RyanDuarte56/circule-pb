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
  Filter
} from 'lucide-react';

const RidesList = () => {
  const { user } = useAuth();
  const { rides, requests } = useRides();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const [sortBy, setSortBy] = useState<string>('time');

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleChatClick = (rideId: string) => {
    navigate(`/chat/${rideId}`);
  };

  // Motorista vê suas próprias caronas oferecidas + pedidos de passageiros
  // Passageiro vê caronas oferecidas por motoristas
  const ridesData = user.isDriver ? [...rides, ...requests] : rides.filter(ride => ride.user.name !== user.name);
  const isDriverView = user.isDriver;



  const filteredRides = ridesData.filter(ride => {
    if (filterType === 'all') return true;
    if (filterType === 'price') {
      // Filtrar caronas com preço (que dividem combustível)
      return ride.shareFuel;
    }
    return true;
  });

  // Aplicar ordenação
  const sortedRides = [...filteredRides].sort((a, b) => {
    if (sortBy === 'time') {
      // Ordenar por horário mais próximo
      return a.time.localeCompare(b.time);
    }
    if (sortBy === 'price' && !isDriverView) {
      // Ordenar por menor preço (apenas para passageiros)
      const priceA = (a as any).price || 0;
      const priceB = (b as any).price || 0;
      return priceA - priceB;
    }
    if (sortBy === 'rating') {
      // Ordenar por melhor avaliação
      return b.user.rating - a.user.rating;
    }
    return 0;
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

          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isDriverView ? "Filtrar pedidos" : "Filtrar caronas"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isDriverView ? 'Todos os pedidos' : 'Todas as caronas'}</SelectItem>
                {!isDriverView && <SelectItem value="price">Com preço</SelectItem>}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">Horário</SelectItem>
                {!isDriverView && <SelectItem value="price">Menor preço</SelectItem>}
                <SelectItem value="rating">Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>


        </div>

        {/* Rides List */}
        <div className="space-y-4 flex-1">
          {sortedRides.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Nenhuma carona encontrada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tente ajustar os filtros ou criar uma nova {isDriverView ? 'oferta' : 'solicitação'}
              </p>
              <Button 
                onClick={() => {
                  setFilterType('all');
                  setSortBy('time');
                }}
                variant="outline"
                size="sm"
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            sortedRides.map((ride) => (
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
              <div className="space-y-2">
                <Button 
                  onClick={() => handleChatClick(ride.id)}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {isDriverView ? 'Responder Pedido' : 'Conversar'}
                </Button>
                
                {/* Botão Confirmar Carona para Passageiros */}
                {!isDriverView && (
                  <Button 
                    onClick={() => navigate('/ride-confirmation', { 
                      state: { 
                        type: 'confirmed',
                        time: ride.time,
                        departure: ride.departure,
                        destination: ride.destination,
                        shareFuel: ride.shareFuel,
                        rideId: ride.id
                      } 
                    })}
                    variant="outline"
                    className="w-full"
                  >
                    Confirmar Carona
                  </Button>
                )}
              </div>
            </div>
          ))
          )}
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