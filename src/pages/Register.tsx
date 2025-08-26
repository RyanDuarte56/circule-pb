import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, Phone, Lock, Calendar, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    occupation: '' as 'aluno' | 'professor' | 'funcionario' | '',
    acceptedTerms: false
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert('Você deve aceitar os termos de uso');
      return;
    }
    
    // Pegar o tipo de usuário da URL
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('userType') || 'passenger';
    
    register({
      name: `${formData.name} ${formData.surname}`,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      occupation: formData.occupation as 'aluno' | 'professor' | 'funcionario',
      isDriver: userType === 'driver'
    });
    
    // Ir para verificação de email com os dados
    navigate(`/email-verification?email=${formData.email}&userType=${userType}`);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Criar Conta</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="João"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname">Sobrenome *</Label>
              <Input
                id="surname"
                placeholder="Silva"
                value={formData.surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="joao.silva@academico.ufpb.br"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="(83) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  placeholder="22"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="pl-10"
                  required
                  min="16"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ocupação *</Label>
              <Select 
                value={formData.occupation} 
                onValueChange={(value) => handleInputChange('occupation', value)}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Selecione" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="funcionario">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="terms"
              checked={formData.acceptedTerms}
              onCheckedChange={(checked) => handleInputChange('acceptedTerms', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-5">
              Aceito os{' '}
              <Link to="/terms" className="text-primary hover:underline">
                termos de uso
              </Link>
              {' '}e{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                política de privacidade
              </Link>
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            disabled={!formData.acceptedTerms}
          >
            Continuar
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
};

export default Register;