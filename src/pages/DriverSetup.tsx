import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, Camera, FileText } from 'lucide-react';

const DriverSetup = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/register" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Cadastro de Motorista</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
          <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <FileText className="w-16 h-16 text-white" />
          </div>

          <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-bold text-gradient">
              Cadastro como Motorista
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Para se cadastrar como motorista, você precisa enviar seu <strong>CRLV</strong> (Certificado de Registro e Licenciamento de Veículo).
            </p>
            <p className="text-sm text-muted-foreground">
              Isso garante a segurança de todos os usuários do Circular.
            </p>
          </div>

          <div className="w-full space-y-4">
            <Button 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => navigate('/driver-crlv')}
            >
              <Camera className="w-4 h-4 mr-2" />
              Tirar Foto do CRLV
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/menu')}
            >
              Pular por Agora
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DriverSetup;