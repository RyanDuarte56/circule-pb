import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileLayout } from '@/components/MobileLayout';
import { useRides } from '@/contexts/RidesContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Navigation, 
  Users, 
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Car
} from 'lucide-react';

const RideHistory = () => {
  const { rideHistory } = useRides();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Mock data para estatísticas
  const stats = {
    totalRides: 24,
    totalPassengers: 67,
    totalEarnings: 340,
    averageRating: 4.8
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/settings" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Histórico de Viagens</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2 mb-2">
              <Car className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Viagens</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalRides}</p>
            <p className="text-xs text-muted-foreground">Total realizadas</p>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Pessoas</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalPassengers}</p>
            <p className="text-xs text-muted-foreground">Transportadas</p>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Arrecadado</span>
            </div>
            <p className="text-2xl font-bold">R$ {stats.totalEarnings}</p>
            <p className="text-xs text-muted-foreground">Em combustível</p>
          </div>

          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-accent fill-current" />
              <span className="text-sm font-medium">Avaliação</span>
            </div>
            <p className="text-2xl font-bold">{stats.averageRating}</p>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="month">Este Mês</TabsTrigger>
            <TabsTrigger value="week">Esta Semana</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Ride History List */}
        <div className="space-y-4 flex-1">
          {rideHistory.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma viagem ainda</h3>
              <p className="text-muted-foreground mb-6">
                Suas viagens concluídas aparecerão aqui
              </p>
              <Link to={user.isDriver ? "/offer-ride" : "/request-ride"}>
                <Button>
                  {user.isDriver ? 'Oferecer Carona' : 'Pedir Carona'}
                </Button>
              </Link>
            </div>
          ) : (
            rideHistory.map((ride) => (
              <div key={ride.id} className="bg-gradient-card rounded-xl p-4 shadow-card border">
                {/* Date and Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(ride.createdAt)}</span>
                    <span>•</span>
                    <span>{ride.time}</span>
                  </div>
                  <Badge 
                    variant={ride.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {ride.status === 'completed' ? 'Concluída' : 'Cancelada'}
                  </Badge>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={ride.user.photo} />
                    <AvatarFallback className="bg-gradient-primary text-white text-sm">
                      {getInitials(ride.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{ride.user.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-xs text-muted-foreground">{ride.user.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {ride.user.occupation}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Route */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-3 h-3 text-secondary" />
                    <span className="text-muted-foreground">{ride.departure}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Navigation className="w-3 h-3 text-accent" />
                    <span className="text-muted-foreground">{ride.destination}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    {ride.availableSeats && (
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{ride.availableSeats} vagas</span>
                      </div>
                    )}
                    
                    {ride.price && (
                      <div className="flex items-center space-x-1 text-accent">
                        <DollarSign className="w-3 h-3" />
                        <span>R$ {ride.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Performance Insights */}
        {rideHistory.length > 0 && (
          <div className="mt-6 bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Insights</h3>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Sua rota mais frequente: CI → Manaíra Shopping</p>
              <p>• Horário preferido: 18:00 - 19:00</p>
              <p>• Economia de combustível: R$ 156 este mês</p>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default RideHistory;