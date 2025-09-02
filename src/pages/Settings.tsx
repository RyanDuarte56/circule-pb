import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Moon, 
  MapPin, 
  MessageSquare,
  Car
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Configurações</h1>
        </div>

        {/* Settings List */}
        <div className="space-y-6 flex-1">
          {/* Notifications */}
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Notificações</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notif">Notificações Push</Label>
                  <p className="text-xs text-muted-foreground">Receber alertas no celular</p>
                </div>
                <Switch id="push-notif" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Notificações por Email</Label>
                  <p className="text-xs text-muted-foreground">Receber resumos por email</p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ride-updates">Atualizações de Carona</Label>
                  <p className="text-xs text-muted-foreground">Avisos sobre suas caronas</p>
                </div>
                <Switch id="ride-updates" defaultChecked />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Privacidade & Segurança</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-phone">Mostrar Telefone</Label>
                  <p className="text-xs text-muted-foreground">Exibir número para outros usuários</p>
                </div>
                <Switch id="show-phone" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-sharing">Compartilhar Localização</Label>
                  <p className="text-xs text-muted-foreground">Durante a viagem</p>
                </div>
                <Switch id="location-sharing" defaultChecked />
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
            <div className="flex items-center space-x-3 mb-4">
              <Moon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Preferências do App</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                  <p className="text-xs text-muted-foreground">Interface com cores escuras</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-location">Localização Automática</Label>
                  <p className="text-xs text-muted-foreground">Detectar CI automaticamente</p>
                </div>
                <Switch id="auto-location" defaultChecked />
              </div>
            </div>
          </div>

          {/* Driver Settings (só aparece para motoristas) */}
          {user.isDriver && (
            <div className="bg-gradient-card rounded-xl p-4 shadow-card border">
              <div className="flex items-center space-x-3 mb-4">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Configurações de Motorista</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-accept">Aceitar Automaticamente</Label>
                    <p className="text-xs text-muted-foreground">Aprovar pedidos da mesma rota</p>
                  </div>
                  <Switch id="auto-accept" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="favorite-route">Rota Favorita Ativa</Label>
                    <p className="text-xs text-muted-foreground">CI → Manaíra Shopping</p>
                  </div>
                  <Switch id="favorite-route" defaultChecked />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link to="/ride-history">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Histórico de Viagens
              </Button>
            </Link>
            
            <Link to="/help">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Central de Ajuda
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer with Team Credit */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground/60 mb-1">
              Desenvolvido com ❤️ por
            </p>
            <p className="text-sm font-medium text-muted-foreground/80">
              Equipe Circular - CI/UFPB
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Versão 1.0.0
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Settings;