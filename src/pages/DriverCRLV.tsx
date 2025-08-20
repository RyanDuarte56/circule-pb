import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, Camera, Upload, CheckCircle } from 'lucide-react';

const DriverCRLV = () => {
  const [photoTaken, setPhotoTaken] = useState(false);
  const navigate = useNavigate();

  const handleTakePhoto = () => {
    // Em produção, abriria a câmera
    setPhotoTaken(true);
  };

  const handleContinue = () => {
    navigate('/driver-cnh');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/driver-setup" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">CRLV do Veículo</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-card rounded-xl flex items-center justify-center mx-auto shadow-card border">
              {photoTaken ? (
                <CheckCircle className="w-16 h-16 text-secondary" />
              ) : (
                <Camera className="w-16 h-16 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {photoTaken ? 'Foto Capturada!' : 'Fotografe seu CRLV'}
              </h2>
              <p className="text-muted-foreground">
                {photoTaken 
                  ? 'Documento capturado com sucesso. Você pode continuar.'
                  : 'Tire uma foto clara do seu CRLV para verificação.'
                }
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {!photoTaken && (
              <>
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  onClick={handleTakePhoto}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Tirar Foto
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar da Galeria
                </Button>
              </>
            )}

            {photoTaken && (
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90"
                onClick={handleContinue}
              >
                Continuar
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Dicas para uma boa foto:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Certifique-se de que o documento esteja bem iluminado</li>
              <li>• Mantenha o celular estável</li>
              <li>• Todos os dados devem estar legíveis</li>
            </ul>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DriverCRLV;