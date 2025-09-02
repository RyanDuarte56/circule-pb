import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import circularLogo from '@/assets/circular-logo.png';

const EmailVerification = () => {
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const userType = searchParams.get('userType');
  const { login } = useAuth();



  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length === 6) {
      // Simular verificação de código
      login(email || 'user@example.com', 'password', userType === 'driver');
      navigate('/menu');
    } else {
      alert('Por favor, insira um código de 6 dígitos.');
    }
  };

  const handleResendCode = () => {
    setIsResending(true);
    setCountdown(30);
    
    // Simular envio de email
    setTimeout(() => {
      setIsResending(false);
      alert('Novo código enviado para seu email!');
    }, 2000);
  };

  const handleBack = () => {
    navigate('/register');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold ml-4">Verificar E-mail</h1>
        </div>

        {/* Logo */}
        <div className="flex justify-center pt-4 pb-6">
          <img src={circularLogo} alt="Circular" className="w-16 h-16" />
        </div>

        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          Verifique seu e-mail
        </h2>
        
        <p className="text-center text-muted-foreground mb-8 px-4">
          Enviamos um código de verificação para{' '}
          <span className="font-medium text-foreground">
            {email || 'seu e-mail'}
          </span>
        </p>

        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-accent/30 rounded-xl">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Demo:</strong> Use o código <span className="font-mono bg-primary/20 px-2 py-1 rounded">123456</span>
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerifyCode} className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Código de Verificação</Label>
            <Input
              id="code"
              type="text"
              placeholder="Digite o código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg font-mono tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={code.length !== 6}
          >
            Verificar Código
          </Button>
        </form>

        {/* Resend Code */}
        <div className="text-center space-y-4 pt-6">
          <p className="text-sm text-muted-foreground">
            Não recebeu o código?
          </p>
          
          <Button
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending || countdown > 0}
            className="text-primary hover:text-primary-glow"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : countdown > 0 ? (
              `Reenviar em ${countdown}s`
            ) : (
              'Reenviar código'
            )}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EmailVerification;