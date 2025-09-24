import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Star,
  MoreHorizontal,
  Flag,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EcoAction {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  action_type: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  xp_reward: number;
  eco_coins_reward: number;
  likes_count: number;
  comments_count: number;
  location?: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface EcoActionCardProps {
  action: EcoAction;
  onUpdate?: () => void;
}

const EcoActionCard: React.FC<EcoActionCardProps> = ({ action, onUpdate }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(action.likes_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('eco_action_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('eco_action_id', action.id);

        if (error) throw error;
        
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like
        const { error } = await supabase
          .from('eco_action_likes')
          .insert({
            user_id: user.id,
            eco_action_id: action.id,
          });

        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: action.title,
          text: action.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Share link copied to clipboard.",
      });
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tree_planting': return 'text-secondary-glow border-secondary-glow';
      case 'solar_installation': return 'text-xp border-xp';
      case 'composting': return 'text-accent border-accent';
      case 'recycling': return 'text-info border-info';
      default: return 'text-primary-glow border-primary-glow';
    }
  };

  const formatActionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="data-point orbital-hover">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={action.profiles?.avatar_url} />
              <AvatarFallback>
                {action.profiles?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm truncate">
                    {action.profiles?.full_name || 'Anonymous User'}
                  </h4>
                  {action.verification_status === 'verified' && (
                    <Badge variant="outline" className="text-secondary-glow border-secondary-glow">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(action.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={getActionTypeColor(action.action_type)}>
                    {formatActionType(action.action_type)}
                  </Badge>
                  
                  {action.location && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {action.location}
                    </Badge>
                  )}
                  
                  {action.verification_status === 'verified' && (
                    <Badge variant="outline" className="xp-glow text-xs">
                      +{action.xp_reward} XP
                    </Badge>
                  )}
                </div>
                
                {action.image_url && (
                  <div className="bg-muted/30 rounded-lg p-2">
                    <img 
                      src={action.image_url} 
                      alt="Eco action" 
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-border/20">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLike}
                      disabled={isLiking}
                      className={isLiked ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      {likesCount}
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {action.comments_count}
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {action.verification_status === 'pending' && (
                    <Badge variant="outline" className="text-warning border-warning">
                      Pending Review
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EcoActionCard;