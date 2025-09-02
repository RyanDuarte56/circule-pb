import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Star,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface RatingData {
  userId: string;
  ratedBy: string;
  rating: number;
  comment: string;
  rideId: string;
  createdAt: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
}

const UserRatings = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Se não há userId na URL, usar o usuário atual
  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    loadUserRatings();
  }, [targetUserId]);

  const loadUserRatings = () => {
    try {
      // Carregar avaliações do localStorage
      const allRatings: RatingData[] = JSON.parse(localStorage.getItem('userRatings') || '[]');
      const userRatings = allRatings.filter(rating => rating.userId === targetUserId);
      
      setRatings(userRatings);
      calculateStats(userRatings);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userRatings: RatingData[]) => {
    if (userRatings.length === 0) {
      setStats({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      return;
    }

    const totalRatings = userRatings.length;
    const sumRatings = userRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = sumRatings / totalRatings;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    userRatings.forEach(rating => {
      distribution[rating.rating as keyof typeof distribution]++;
    });

    setStats({
      averageRating,
      totalRatings,
      ratingDistribution: distribution
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 3.5) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 2.5) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to={isOwnProfile ? "/profile" : "/menu"} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-semibold ml-4">
            {isOwnProfile ? 'Minhas Avaliações' : 'Avaliações do Usuário'}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <div className="bg-gradient-card rounded-xl p-6 shadow-card border mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
                    </h2>
                    <p className="text-sm text-muted-foreground">Avaliação média</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{stats.totalRatings}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">avaliações</p>
                </div>
              </div>

              {/* Rating Distribution */}
              {stats.totalRatings > 0 && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.ratingDistribution[star];
                    const percentage = (count / stats.totalRatings) * 100;
                    return (
                      <div key={star} className="flex items-center space-x-2 text-sm">
                        <span className="w-3">{star}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ratings List */}
            <div className="space-y-4">
              {ratings.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile 
                      ? 'Você ainda não recebeu avaliações. Complete algumas caronas para começar a receber feedback!'
                      : 'Este usuário ainda não possui avaliações.'}
                  </p>
                </div>
              ) : (
                ratings.map((rating, index) => (
                  <div key={index} className="bg-card rounded-xl p-4 shadow-sm border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-white text-sm">
                            {getInitials('Usuário Anônimo')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Usuário Anônimo</p>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(rating.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getRatingBadgeColor(rating.rating)}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {rating.rating}.0
                      </Badge>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{rating.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Info */}
            {isOwnProfile && (
              <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Mantenha uma boa avaliação sendo pontual, educado e respeitoso com outros usuários. 
                    Avaliações positivas aumentam sua confiabilidade na plataforma.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default UserRatings;