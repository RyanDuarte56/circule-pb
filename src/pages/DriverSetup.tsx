import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, Camera, FileText, Car, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DriverSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    color: ''
  });
  const [cnhFile, setCnhFile] = useState<File | null>(null);
  const [crlvFile, setCrlvFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleDataChange = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'cnh' | 'crlv', file: File | null) => {
    if (type === 'cnh') {
      setCnhFile(file);
    } else {
      setCrlvFile(file);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validar dados do veículo
      if (!vehicleData.brand || !vehicleData.model || !vehicleData.year || !vehicleData.plate) {
        setError('Preencha todos os campos obrigatórios do veículo.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      // Validar documentos
      if (!cnhFile || !crlvFile) {
        setError('Envie ambos os documentos (CNH e CRLV).');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simular processamento dos documentos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar usuário para ter perfil de motorista
      if (user) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.id === user.id) {
            return {
              ...u,
              hasDriverProfile: true,
              isDriver: true,
              vehicleData,
              cnhDocument: cnhFile?.name,
              crlvDocument: crlvFile?.name
            };
          }
          return u;
        });
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        const updatedUser = {
          ...user,
          hasDriverProfile: true,
          isDriver: true,
          vehicleData,
          cnhDocument: cnhFile?.name,
          crlvDocument: crlvFile?.name
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      navigate('/menu');
    } catch (error) {
      setError('Erro ao processar documentos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to={user?.hasPassengerProfile ? "/profile" : "/register"} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Cadastro de Motorista</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 ${
              step >= 2 ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Vehicle Data */}
        {step === 1 && (
          <div className="flex-1 space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow mx-auto mb-4">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gradient mb-2">Dados do Veículo</h2>
              <p className="text-muted-foreground text-sm">Informe os dados do seu veículo</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  placeholder="Ex: Toyota, Honda, Volkswagen"
                  value={vehicleData.brand}
                  onChange={(e) => handleVehicleDataChange('brand', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  placeholder="Ex: Corolla, Civic, Gol"
                  value={vehicleData.model}
                  onChange={(e) => handleVehicleDataChange('model', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    placeholder="2020"
                    value={vehicleData.year}
                    onChange={(e) => handleVehicleDataChange('year', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    placeholder="Branco"
                    value={vehicleData.color}
                    onChange={(e) => handleVehicleDataChange('color', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa *</Label>
                <Input
                  id="plate"
                  placeholder="ABC-1234"
                  value={vehicleData.plate}
                  onChange={(e) => handleVehicleDataChange('plate', e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <Button 
              onClick={handleNextStep}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Próximo: Documentos
            </Button>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="flex-1 space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gradient mb-2">Documentos</h2>
              <p className="text-muted-foreground text-sm">Envie sua CNH e CRLV para validação</p>
            </div>

            <div className="space-y-6">
              {/* CNH Upload */}
              <div className="space-y-3">
                <Label>CNH (Carteira Nacional de Habilitação) *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('cnh', e.target.files?.[0] || null)}
                    className="hidden"
                    id="cnh-upload"
                  />
                  <label htmlFor="cnh-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {cnhFile ? cnhFile.name : 'Clique para enviar foto da CNH'}
                    </p>
                  </label>
                </div>
              </div>

              {/* CRLV Upload */}
              <div className="space-y-3">
                <Label>CRLV (Certificado de Registro e Licenciamento) *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('crlv', e.target.files?.[0] || null)}
                    className="hidden"
                    id="crlv-upload"
                  />
                  <label htmlFor="crlv-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {crlvFile ? crlvFile.name : 'Clique para enviar foto do CRLV'}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleNextStep}
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isLoading ? 'Processando...' : 'Finalizar Cadastro'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full"
                disabled={isLoading}
              >
                Voltar
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default DriverSetup;