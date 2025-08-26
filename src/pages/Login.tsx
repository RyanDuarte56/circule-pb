import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Chrome } from 'lucide-react';
import circularLogo from '@/assets/circular-logo.png';
import heroBanner from '@/assets/hero-banner.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/user-type-selection?from=login');
  };

  const handleGoogleLogin = () => {
    navigate('/user-type-selection?from=login');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <img src={circularLogo} alt="Circular" className="w-24 h-24" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 text-gradient">
          Circular
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Caronas Universitárias - CI/UFPB
        </p>

        {/* Hero Banner */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-card">
          <img 
            src={heroBanner} 
            alt="Caronas Universitárias" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-semibold">Mobilidade no Campus</h2>
            <p className="text-sm opacity-90">Conectando a comunidade do CI</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu.email@academico.ufpb.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Entrar
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Entrar com Google
            </Button>

            <div className="text-center">
              <Link 
                to="/user-type-selection?from=register" 
                className="text-primary hover:text-primary-glow transition-colors"
              >
                Não tem conta? Cadastre-se
              </Link>
            </div>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default Login;