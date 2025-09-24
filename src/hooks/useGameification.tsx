import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserBadge {
  id: string;
  badge_id: string;
  awarded_at: string;
  badge: Badge;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
}

interface UserChallenge {
  id: string;
  challenge_id: string;
  completed: boolean;
  completed_at?: string;
  challenge: Challenge;
}

export const useGameification = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate level from XP
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  // Get XP needed for next level
  const getXPForNextLevel = (currentXP: number) => {
    const currentLevel = calculateLevel(currentXP);
    const nextLevelXP = currentLevel * 100;
    return nextLevelXP - currentXP;
  };

  // Award XP and update profile
  const awardXP = async (amount: number, reason: string) => {
    if (!user || !profile) return;

    try {
      const newXP = profile.xp + amount;
      const newLevel = calculateLevel(newXP);
      const levelUp = newLevel > profile.level;

      // Update profile
      await updateProfile({
        xp: newXP,
        level: newLevel,
      });

      // Show XP toast
      toast({
        title: `+${amount} XP Earned!`,
        description: reason,
        className: "xp-glow border-xp",
      });

      // Show level up toast if applicable
      if (levelUp) {
        toast({
          title: `🎉 Level Up!`,
          description: `Congratulations! You've reached Level ${newLevel}!`,
          className: "bg-gradient-to-r from-xp to-badge border-badge",
        });

        // Award bonus EcoCoins for leveling up
        await awardEcoCoins(newLevel * 10, `Level ${newLevel} bonus!`);
      }

      return { success: true, levelUp };
    } catch (error) {
      console.error('Error awarding XP:', error);
      return { success: false, levelUp: false };
    }
  };

  // Award EcoCoins
  const awardEcoCoins = async (amount: number, reason: string) => {
    if (!user || !profile) return;

    try {
      const newEcoCoins = profile.eco_coins + amount;
      
      await updateProfile({
        eco_coins: newEcoCoins,
      });

      toast({
        title: `+${amount} EcoCoins`,
        description: reason,
        className: "border-secondary-glow bg-secondary-glow/10",
      });

      return { success: true };
    } catch (error) {
      console.error('Error awarding EcoCoins:', error);
      return { success: false };
    }
  };

  // Complete a challenge
  const completeChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      // Mark challenge as completed
      const { error } = await supabase
        .from('user_challenges')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

      if (error) throw error;

      // Find the challenge to get XP reward
      const challenge = challenges.find(c => c.challenge_id === challengeId);
      if (challenge) {
        await awardXP(challenge.challenge.xp_reward, `Completed: ${challenge.challenge.title}`);
      }

      // Refresh challenges
      await fetchChallenges();

      return { success: true };
    } catch (error) {
      console.error('Error completing challenge:', error);
      return { success: false };
    }
  };

  // Fetch user badges
  const fetchBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setBadges((data || []) as UserBadge[]);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Fetch user challenges
  const fetchChallenges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  // Track session for XP
  const trackSession = async (sessionType: string, duration: number, xpEarned: number = 0) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          duration_minutes: duration,
          xp_earned: xpEarned,
          eco_coins_earned: Math.floor(xpEarned / 10), // 1 EcoCoin per 10 XP
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking session:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([
          fetchBadges(),
          fetchChallenges(),
        ]);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  return {
    // Data
    badges,
    challenges,
    loading,
    
    // Computed values
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    ecoCoins: profile?.eco_coins || 0,
    xpForNextLevel: profile?.xp ? getXPForNextLevel(profile.xp) : 100,
    
    // Actions
    awardXP,
    awardEcoCoins,
    completeChallenge,
    trackSession,
    
    // Refresh functions
    fetchBadges,
    fetchChallenges,
  };
};