import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

interface RatingData {
  userId: string;
  ratedBy: string;
  rating: number;
  comment: string;
  rideId: string;
  createdAt: string;
}

const RateUser = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dados do usuário a ser avaliado (vindos do state da navegação)
  const userToRate = location.state?.user || {
    name: 'Usuário',
    photo: '',
    occupation: 'aluno'
  };
  const rideId = location.state?.rideId || '';

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular salvamento da avaliação
      const ratingData: RatingData = {
        userId: userId || '',
        ratedBy: user?.id || '',
        rating,
        comment,
        rideId,
        createdAt: new Date().toISOString()
      };

      // Salvar no localStorage (em produção seria uma API)
      const existingRatings = JSON.parse(localStorage.getItem('userRatings') || '[]');
      existingRatings.push(ratingData);
      localStorage.setItem('userRatings', JSON.stringify(existingRatings));

      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navegar de volta com sucesso
      navigate('/menu', {
        state: {
          message: `Avaliação enviada com sucesso! Obrigado pelo feedback sobre ${userToRate.name}.`
        }
      });
    } catch (error) {
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Muito ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'Selecione uma avaliação';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-500';
    if (rating === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/menu" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">Avaliar Usuário</h1>
        </div>

        {/* User Info */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card border mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userToRate.photo} />
              <AvatarFallback className="bg-gradient-primary text-white text-lg">
                {getInitials(userToRate.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{userToRate.name}</h2>
              <p className="text-muted-foreground capitalize">{userToRate.occupation}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Como foi sua experiência compartilhando uma corrida com {userToRate.name.split(' ')[0]}?
          </p>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          {/* Star Rating */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Sua avaliação</Label>
            <div className="flex items-center justify-center space-x-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {rating > 0 && (
              <div className="text-center">
                <p className={`font-medium ${getRatingColor(rating)}`}>
                  {getRatingText(rating)}
                </p>
              </div>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Compartilhe detalhes sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Quick Feedback Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Feedback rápido:</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setRating(5);
                  setComment('Excelente companhia, pontual e educado(a)!');
                }}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Recomendo</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setRating(2);
                  setComment('Experiência não foi das melhores.');
                }}
                className="flex items-center space-x-2"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Não recomendo</span>
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enviar Avaliação
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Suas avaliações ajudam a manter a comunidade segura e confiável. 
              Seja honesto e construtivo em seus comentários.
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RateUser;