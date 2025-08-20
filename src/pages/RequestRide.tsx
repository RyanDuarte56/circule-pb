import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, Clock, MapPin, Navigation, MessageSquare, DollarSign } from 'lucide-react';

const RequestRide = () => {
  const [formData, setFormData] = useState({
    time: '',
    departure: '',
    destination: '',
    description: '',
    shareFuel: false
  });
  
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, enviaria para API
    navigate('/rides');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Pedir Carona</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="time">Horário *</Label>
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
                placeholder="Informações adicionais sobre sua viagem..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="pl-10 min-h-[80px] resize-none"
              />
            </div>
          </div>

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
                Contribuir com os custos da viagem
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 mt-8"
          >
            Pedir Carona
          </Button>
        </form>

        {/* Tips */}
        <div className="bg-muted rounded-lg p-4 mt-6">
          <h3 className="font-medium mb-2">💡 Dicas para conseguir uma carona:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Seja flexível com horários</li>
            <li>• Ofereça-se para dividir o combustível</li>
            <li>• Seja pontual no local de encontro</li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RequestRide;