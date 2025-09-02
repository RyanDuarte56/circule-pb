import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileLayout } from '@/components/MobileLayout';
import { useRides } from '@/contexts/RidesContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Clock, MapPin, Navigation, MessageSquare, DollarSign, Users, Route } from 'lucide-react';

const OfferRide = () => {
  const [formData, setFormData] = useState({
    time: '',
    seats: '',
    departure: '',
    destination: '',
    description: '',
    shareFuel: false,
    allowDetour: false,
    price: ''
  });
  
  const navigate = useNavigate();
  const { addRide } = useRides();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addRide({
      user: {
        name: user.name,
        photo: user.photo || '',
        rating: 4.8,
        occupation: user.occupation
      },
      time: formData.time,
      departure: formData.departure,
      destination: formData.destination,
      description: formData.description,
      shareFuel: formData.shareFuel,
      allowDetour: formData.allowDetour,
      availableSeats: parseInt(formData.seats),
      price: formData.price ? parseFloat(formData.price) : undefined,
      vehicle: 'Veículo do usuário' // Em produção viria do perfil
    });

    navigate('/ride-confirmation', { 
      state: { 
        type: 'offer',
        ...formData
      } 
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Oferecer Carona</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Horário de Saída *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats">Vagas Disponíveis *</Label>
              <Select value={formData.seats} onValueChange={(value) => handleInputChange('seats', value)}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Vagas" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 vaga</SelectItem>
                  <SelectItem value="2">2 vagas</SelectItem>
                  <SelectItem value="3">3 vagas</SelectItem>
                  <SelectItem value="4">4 vagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="departure">Local de Saída *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="departure"
                placeholder="Ex: CI - Centro de Informática"
                value={formData.departure}
                onChange={(e) => handleInputChange('departure', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destino *</Label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="destination"
                placeholder="Ex: Manaíra Shopping"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                placeholder="Informações sobre o veículo, paradas, etc..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="pl-10 min-h-[80px] resize-none"
              />
            </div>
          </div>

            <div className="space-y-4">
            <div className="flex items-start space-x-3 bg-gradient-card rounded-lg p-4 border">
              <Checkbox
                id="shareFuel"
                checked={formData.shareFuel}
                onCheckedChange={(checked) => handleInputChange('shareFuel', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="shareFuel" className="flex items-center space-x-2 cursor-pointer">
                  <DollarSign className="w-4 h-4 text-accent" />
                  <span>Dividir combustível</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Permitir que passageiros contribuam com os custos
                </p>
                {formData.shareFuel && (
                  <div className="mt-3">
                    <Label htmlFor="price" className="text-xs">Valor sugerido (opcional)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Ex: 5.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="mt-1 h-8 text-sm"
                      step="0.50"
                      min="0"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-gradient-card rounded-lg p-4 border">
              <Checkbox
                id="allowDetour"
                checked={formData.allowDetour}
                onCheckedChange={(checked) => handleInputChange('allowDetour', checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="allowDetour" className="flex items-center space-x-2 cursor-pointer">
                  <Route className="w-4 h-4 text-accent" />
                  <span>Aceitar pequenos desvios</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Permitir alterações menores na rota para pegar passageiros
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90 transition-all duration-300 mt-8"
          >
            Adicionar Carona
          </Button>
        </form>

        {/* Tips */}
        <div className="bg-muted rounded-lg p-4 mt-6">
          <h3 className="font-medium mb-2">🚗 Dicas para oferecer carona:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Confirme o local e horário com antecedência</li>
            <li>• Mantenha seu veículo limpo e seguro</li>
            <li>• Seja pontual e comunique eventuais atrasos</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default OfferRide;