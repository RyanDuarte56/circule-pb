import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MobileLayout } from '@/components/MobileLayout';
import { 
  ArrowLeft, 
  Search, 
  Shield, 
  Users, 
  Car, 
  MessageCircle,
  Clock,
  DollarSign,
  ChevronDown,
  HelpCircle,
  Phone,
  Mail
} from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const faqData = [
    {
      id: 'cancel-ride',
      question: 'Quero desistir da carona, como faço?',
      answer: 'Você pode cancelar sua carona até 30 minutos antes do horário marcado. Acesse "Minhas Caronas" no menu, selecione a carona e toque em "Cancelar". O motorista e outros passageiros serão notificados automaticamente.',
      icon: <Clock className="w-4 h-4 text-destructive" />
    },
    {
      id: 'driver-cancel',
      question: 'O que acontece se o motorista cancelar a viagem?',
      answer: 'Se o motorista cancelar, todos os passageiros serão notificados imediatamente. Você receberá sugestões de caronas alternativas no mesmo horário e rota. Cancelamentos frequentes podem afetar a avaliação do motorista.',
      icon: <Car className="w-4 h-4 text-accent" />
    },
    {
      id: 'payment',
      question: 'Como funciona o pagamento da carona?',
      answer: 'O pagamento é combinado diretamente entre passageiro e motorista. Pode ser em dinheiro, PIX ou divisão do combustível. O valor é acordado antes da confirmação da carona.',
      icon: <DollarSign className="w-4 h-4 text-secondary" />
    },
    {
      id: 'safety',
      question: 'Como garantir minha segurança?',
      answer: 'Todos os usuários passam por verificação de identidade. Sempre confira a avaliação do motorista/passageiro, compartilhe detalhes da viagem com conhecidos e use o chat do app para comunicação.',
      icon: <Shield className="w-4 h-4 text-primary" />
    },
    {
      id: 'contact-driver',
      question: 'Não consigo contatar o motorista, e agora?',
      answer: 'Use o chat integrado do app ou tente ligar. Se não conseguir contato 15 minutos antes da viagem, cancele a carona e procure uma alternativa. Você pode reportar o problema no app.',
      icon: <MessageCircle className="w-4 h-4 text-accent" />
    },
    {
      id: 'rating',
      question: 'Como funciona o sistema de avaliação?',
      answer: 'Após cada viagem, motorista e passageiros podem se avaliar de 1 a 5 estrelas. Avaliações baixas podem resultar em suspensão da conta. Seja honesto e respeitoso nas avaliações.',
      icon: <Users className="w-4 h-4 text-secondary" />
    }
  ];

  const filteredFAQs = faqData.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Central de Ajuda</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Identity Verification Section */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card border mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Verificação de Identidade</h3>
              <p className="text-sm text-muted-foreground">Sua segurança é nossa prioridade</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Todos os usuários são verificados:</strong> Antes de usar o app, 
              cada pessoa passa por um processo de confirmação de identidade com documentos válidos.
            </p>
            <p>
              <strong className="text-foreground">Motoristas têm verificação adicional:</strong> CNH, CRLV 
              e histórico de direção são analisados para garantir viagens seguras.
            </p>
            <p>
              <strong className="text-foreground">Comunidade UFPB:</strong> Apenas membros da comunidade 
              universitária (alunos, professores e funcionários) podem se cadastrar.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Perguntas Frequentes</h2>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma pergunta encontrada para "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <Collapsible
                  key={faq.id}
                  open={openFAQ === faq.id}
                  onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between p-4 h-auto text-left hover:bg-gradient-card"
                    >
                      <div className="flex items-center space-x-3">
                        {faq.icon}
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-3 text-sm text-muted-foreground bg-gradient-card rounded-b-lg border border-t-0">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-gradient-card rounded-xl p-4 shadow-card border">
          <h3 className="font-semibold mb-3 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2 text-primary" />
            Ainda precisa de ajuda?
          </h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Mail className="w-4 h-4 mr-2" />
              suporte@circular.ufpb.br
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" />
              (83) 3216-7000
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Horário de atendimento: Segunda a Sexta, 8h às 17h
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Help;