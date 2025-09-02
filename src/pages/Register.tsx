import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, Phone, Lock, Calendar, Briefcase, Upload, FileText, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    occupation: '' as 'aluno' | 'professor' | 'funcionario' | 'terceirizado' | '',
    acceptedTerms: false,
    document: null as File | null
  });
  
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo (apenas imagens)
      if (!file.type.startsWith('image/')) {
        alert('Por favor, envie apenas arquivos de imagem (JPG, PNG, etc.)');
        return;
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        return;
      }
      handleInputChange('document', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms) {
      setError('Você deve aceitar os termos de uso e política de privacidade.');
      return;
    }

    if (formData.occupation === 'terceirizado' && !formData.document) {
      setError('Terceirizados devem enviar um documento para validação.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      // Registrar usuário com senha
      const newUser = register({
        name: `${formData.name} ${formData.surname}`,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age),
        occupation: formData.occupation as 'aluno' | 'professor' | 'funcionario' | 'terceirizado',
        isDriver: false,
        document: formData.document,
        needsValidation: formData.occupation === 'terceirizado',
        isValidated: formData.occupation !== 'terceirizado',
        validationStatus: formData.occupation === 'terceirizado' ? 'pending' : 'approved',
        password: formData.password
      });

      // Redirecionar baseado na ocupação
      if (formData.occupation === 'terceirizado') {
        navigate(`/email-verification?email=${encodeURIComponent(formData.email)}&userType=passenger`);
      } else {
        navigate(`/user-type-selection?from=register&email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao cadastrar usuário.');
    }
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                  <SelectItem value="terceirizado">Terceirizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Validação de Terceirizados */}
          {formData.occupation === 'terceirizado' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-medium text-amber-800">Validação de Terceirizado</h3>
                  <p className="text-sm text-amber-700">
                    Como terceirizado, você precisa enviar um documento que comprove seu vínculo com a UFPB 
                    (crachá, contrato, declaração, etc.) para validação manual pela administração.
                  </p>
                  <p className="text-xs text-amber-600">
                    Seu acesso será liberado após a aprovação do documento, que pode levar até 2 dias úteis.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document">Documento de Validação *</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      id="document"
                      type="file"
                      accept="image/*"
                      onChange={handleDocumentUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  {formData.document && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Enviado</span>
                    </div>
                  )}
                </div>
                {formData.document && (
                  <p className="text-xs text-muted-foreground">
                    Arquivo: {formData.document.name} ({(formData.document.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          )}

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