import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { Car, Users, ArrowRight, Settings } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import circularLogo from '@/assets/circular-logo.png';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || 'login';
  const userType = searchParams.get('userType');
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const { login } = useAuth();
  const [selectedType, setSelectedType] = React.useState<'passenger' | 'driver'>(
    (userType as 'passenger' | 'driver') || 'passenger'
  );
  const [setAsDefault, setSetAsDefault] = React.useState(false);

  const handleContinue = () => {
    // Salvar preferências no localStorage
    if (setAsDefault) {
      localStorage.setItem('skipUserTypeSelection', 'true');
      localStorage.setItem('defaultUserType', selectedType);
    }
    
    if (from === 'register' && email && password) {
      // Se o usuário selecionou motorista, redirecionar para configuração de motorista
      if (selectedType === 'driver') {
        try {
          // Fazer login como passageiro primeiro
          login(email, password, false);
          // Redirecionar para configuração de motorista
          navigate('/driver-setup');
        } catch (error) {
          console.error('Erro ao fazer login após cadastro:', error);
          navigate('/login');
        }
      } else {
        // Se selecionou passageiro, fazer login normalmente
        try {
          login(email, password, false);
          navigate('/menu');
        } catch (error) {
          console.error('Erro ao fazer login após cadastro:', error);
          navigate('/login');
        }
      }
    } else if (from === 'login' && email && password) {
      // Fazer login com os dados reais do usuário
      try {
        login(email, password, selectedType === 'driver');
        navigate('/menu');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        navigate('/login');
      }
    } else {
      // Fallback para login se não tiver dados
      navigate('/login');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <img src={circularLogo} alt="Circular" className="w-20 h-20" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2 text-gradient">
          Como você vai usar o Circular?
        </h1>
        <p className="text-center text-muted-foreground mb-12 px-4">
          Escolha como você pretende utilizar nossa plataforma
        </p>

        {/* Type Selection Cards */}
        <div className="flex-1 space-y-4">
          <RadioGroup 
            value={selectedType} 
            onValueChange={(value) => setSelectedType(value as 'passenger' | 'driver')}
            className="space-y-4"
          >
            {/* Passageiro Card */}
            <div className="relative">
              <RadioGroupItem value="passenger" id="passenger" className="sr-only" />
              <Label 
                htmlFor="passenger" 
                className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedType === 'passenger' 
                    ? 'border-primary bg-primary/5 shadow-elegant' 
                    : 'border-border bg-card hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    selectedType === 'passenger' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Passageiro</h3>
                    <p className="text-sm text-muted-foreground">
                      Procurar corridas oferecidas por motoristas
                    </p>
                  </div>
                  {selectedType === 'passenger' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                </div>
              </Label>
            </div>

            {/* Motorista Card */}
            <div className="relative">
              <RadioGroupItem value="driver" id="driver" className="sr-only" />
              <Label 
                htmlFor="driver" 
                className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedType === 'driver' 
                    ? 'border-primary bg-primary/5 shadow-elegant' 
                    : 'border-border bg-card hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    selectedType === 'driver' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}>
                    <Car className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">Motorista</h3>
                    <p className="text-sm text-muted-foreground">
                      Oferecer corridas para a comunidade do CI
                    </p>
                  </div>
                  {selectedType === 'driver' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                  )}
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Benefits Section */}
          <div className="mt-8 p-4 rounded-xl bg-accent/30">
            <h4 className="font-medium mb-2">
              {selectedType === 'passenger' ? 'Como passageiro você pode:' : 'Como motorista você pode:'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {selectedType === 'passenger' ? (
                <>
                  <li>• Encontrar caronas para o campus</li>
                  <li>• Dividir custos de combustível</li>
                  <li>• Conectar-se com a comunidade</li>
                </>
              ) : (
                <>
                  <li>• Oferecer corridas e ajudar colegas</li>
                  <li>• Dividir custos de combustível</li>
                  <li>• Construir uma rede de contatos</li>
                </>
              )}
            </ul>
          </div>

          {/* Preferences Section */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Preferências</h4>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="setDefault"
                checked={setAsDefault}
                onCheckedChange={(checked) => setSetAsDefault(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="setDefault" className="text-sm font-medium text-blue-800">
                  Definir como padrão
                </Label>
                <p className="text-xs text-blue-600">
                  Esta tela não aparecerá mais ao fazer login. Você pode alterar isso nas configurações.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <Button 
            onClick={handleContinue}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Continuar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="w-full"
          >
            Voltar
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default UserTypeSelection;