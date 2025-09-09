import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Star,
  Trash2,
  Plus,
  Route
} from 'lucide-react';

interface FavoriteRouteData {
  id: string;
  name: string;
  departure: string;
  destination: string;
  createdAt: string;
}

const FavoriteRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRouteData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    departure: '',
    destination: ''
  });

  useEffect(() => {
    // Carregar rotas favoritas do localStorage
    const savedRoutes = localStorage.getItem(`favoriteRoutes_${user?.id}`);
    if (savedRoutes) {
      setFavoriteRoutes(JSON.parse(savedRoutes));
    }
  }, [user?.id]);

  const saveRoutesToStorage = (routes: FavoriteRouteData[]) => {
    localStorage.setItem(`favoriteRoutes_${user?.id}`, JSON.stringify(routes));
    setFavoriteRoutes(routes);
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRoute.name || !newRoute.departure || !newRoute.destination) {
      alert('Preencha todos os campos');
      return;
    }

    const route: FavoriteRouteData = {
      id: Date.now().toString(),
      name: newRoute.name,
      departure: newRoute.departure,
      destination: newRoute.destination,
      createdAt: new Date().toISOString()
    };

    const updatedRoutes = [...favoriteRoutes, route];
    saveRoutesToStorage(updatedRoutes);
    
    setNewRoute({ name: '', departure: '', destination: '' });
    setIsAdding(false);
  };

  const handleDeleteRoute = (routeId: string) => {
    const updatedRoutes = favoriteRoutes.filter(route => route.id !== routeId);
    saveRoutesToStorage(updatedRoutes);
  };

  const handleUseRoute = (route: FavoriteRouteData) => {
    // Navegar para a tela de pedido de corrida com os dados preenchidos
    navigate('/request-ride', {
      state: {
        departure: route.departure,
        destination: route.destination
      }
    });
  };

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Rotas Favoritas</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Salve suas rotas mais utilizadas para facilitar futuras solicitações de corrida.
        </p>

        {/* Add New Route Form */}
        {isAdding && (
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nova Rota Favorita
            </h3>
            
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Nome da Rota</Label>
                <Input
                  id="routeName"
                  placeholder="Ex: Casa → Universidade"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departure">Local de Saída</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departure"
                    placeholder="Digite o local de saída"
                    value={newRoute.departure}
                    onChange={(e) => setNewRoute({ ...newRoute, departure: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="Digite o destino"
                    value={newRoute.destination}
                    onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1 bg-gradient-primary">
                  Salvar Rota
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewRoute({ name: '', departure: '', destination: '' });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Favorite Routes List */}
        <div className="flex-1">
          {favoriteRoutes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Route className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Nenhuma rota favorita</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Adicione suas rotas mais utilizadas para agilizar futuras solicitações.
              </p>
              {!isAdding && (
                <Button 
                  onClick={() => setIsAdding(true)}
                  className="bg-gradient-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Rota
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteRoutes.map((route) => (
                <div key={route.id} className="bg-gradient-card rounded-xl p-4 shadow-card border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <h3 className="font-semibold">{route.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRoute(route.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="font-medium">Saída:</span>
                      <span className="text-muted-foreground">{route.departure}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Navigation className="w-4 h-4 text-accent" />
                      <span className="font-medium">Destino:</span>
                      <span className="text-muted-foreground">{route.destination}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleUseRoute(route)}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    Usar Esta Rota
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Route Button */}
        {favoriteRoutes.length > 0 && !isAdding && (
          <div className="mt-6">
            <Button 
              onClick={() => setIsAdding(true)}
              variant="outline" 
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Rota
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default FavoriteRoute;