import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { CheckCircle, Car, UserCheck, Clock, MapPin, Navigation } from 'lucide-react';

interface RideData {
  type: 'offer' | 'request';
  time: string;
  departure: string;
  destination: string;
  seats?: string;
  shareFuel: boolean;
  allowDetour?: boolean;
}

const RideConfirmation = () => {
  const location = useLocation();
  const rideData = location.state as RideData;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!rideData) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <p>Dados da carona não encontrados</p>
          <Link to="/menu">
            <Button className="mt-4">Voltar ao Menu</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const isOffer = rideData.type === 'offer';

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen p-6">
        <div className={`flex flex-col items-center text-center space-y-6 transition-all duration-500 ${showSuccess ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Success Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              {isOffer ? <Car className="w-4 h-4 text-white" /> : <UserCheck className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {isOffer ? 'Carona Oferecida!' : 'Carona Solicitada!'}
            </h1>
            <p className="text-muted-foreground">
              {isOffer 
                ? 'Sua carona foi adicionada com sucesso. Os passageiros poderão vê-la na lista.'
                : 'Sua solicitação foi enviada. Os motoristas poderão vê-la e entrar em contato.'
              }
            </p>
          </div>

          {/* Ride Details Card */}
          <div className="w-full max-w-sm bg-gradient-card border rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{rideData.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Saída</p>
                <p className="font-medium">{rideData.departure}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Navigation className="w-5 h-5 text-accent" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Destino</p>
                <p className="font-medium">{rideData.destination}</p>
              </div>
            </div>

            {isOffer && rideData.seats && (
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5 text-accent" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Vagas</p>
                  <p className="font-medium">{rideData.seats}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-3 border-t space-y-2">
              {rideData.shareFuel && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Divisão de combustível</span>
                </div>
              )}
              {isOffer && rideData.allowDetour && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Aceita pequenos desvios</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-3 pt-4">
            <Link to="/rides" className="block">
              <Button className="w-full bg-gradient-primary hover:shadow-glow">
                Ver {isOffer ? 'Minhas Caronas' : 'Caronas Disponíveis'}
              </Button>
            </Link>
            
            <Link to="/menu" className="block">
              <Button variant="outline" className="w-full">
                Voltar ao Menu
              </Button>
            </Link>
          </div>

          {/* Next Steps */}
          <div className="bg-muted rounded-lg p-4 text-left w-full">
            <h3 className="font-medium mb-2">📱 Próximos passos:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {isOffer ? (
                <>
                  <li>• Aguarde solicitações de passageiros</li>
                  <li>• Verifique suas mensagens regularmente</li>
                  <li>• Confirme detalhes antes da viagem</li>
                </>
              ) : (
                <>
                  <li>• Aguarde confirmação de motoristas</li>
                  <li>• Fique atento às mensagens</li>
                  <li>• Seja flexível com horários</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RideConfirmation;