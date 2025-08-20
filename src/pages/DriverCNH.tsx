import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, CreditCard, FileText, CheckCircle } from 'lucide-react';

const DriverCNH = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    cnhNumber: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, enviaria para API
    navigate('/menu');
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/driver-crlv" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Dados da CNH</h1>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto shadow-glow">
              <CreditCard className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gradient">
                Informações da CNH
              </h2>
              <p className="text-muted-foreground">
                Informe os dados da sua Carteira Nacional de Habilitação
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                  className="pl-10"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnhNumber">Número de Registro da CNH *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cnhNumber"
                  placeholder="Ex: 12345678901"
                  value={formData.cnhNumber}
                  onChange={(e) => handleInputChange('cnhNumber', e.target.value)}
                  className="pl-10"
                  maxLength={11}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalizar Cadastro de Motorista
              </Button>
            </div>
          </form>

          {/* Info */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Sobre a verificação</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Seus dados serão verificados em até 24 horas. Você receberá uma notificação quando a aprovação for concluída.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DriverCNH;