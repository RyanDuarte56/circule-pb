import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  Star,
  MessageCircle
} from 'lucide-react';

import { useRides } from '@/contexts/RidesContext';

const Chat = () => {
  const { rideId } = useParams();
  const { user } = useAuth();
  const { rides, requests } = useRides();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  
  // Encontrar a corrida
  const ride = [...rides, ...requests].find(r => r.id === rideId);
  
  if (!ride || !user) {
    return (
      <MobileLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Corrida não encontrada</h3>
          <p className="text-muted-foreground mb-6">
            Esta conversa não está mais disponível
          </p>
          <Link to="/rides-list">
            <Button>Voltar às Corridas</Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }
  
  const contact = ride.user;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleConfirmRide = () => {
    setRideConfirmed(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) return null;

  return (
    <MobileLayout showPadding={false}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gradient-card border-b p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/rides" className="p-1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Avatar className="w-10 h-10">
                <AvatarImage src={contact.photo} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{contact.name}</h2>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 text-accent fill-current" />
                  <span>{contact.rating}</span>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Ride Info */}
        <div className="bg-muted p-4 border-b">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-primary" />
              <span>{ride.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>{ride.departure} → {ride.destination}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mensagem ainda</p>
                <p className="text-sm">Inicie uma conversa sobre a corrida</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-card border'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-70">{msg.time}</span>
                    {msg.sender === 'me' && msg.isRead && (
                      <CheckCircle className="w-3 h-3 opacity-70" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ride Confirmation */}
        {!rideConfirmed && (
          <div className="p-4 bg-gradient-card border-t">
            <Button 
              onClick={handleConfirmRide}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Carona
            </Button>
          </div>
        )}

        {rideConfirmed && (
          <div className="p-4 bg-secondary/10 border-t">
            <div className="flex items-center justify-center space-x-2 text-secondary">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Corrida confirmada!</span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="sm" className="bg-gradient-primary">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Chat;