-- Fix security linter issues: Add search_path to functions that need it

-- Fix function search paths
CREATE OR REPLACE FUNCTION update_eco_action_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update likes count
  IF TG_TABLE_NAME = 'eco_action_likes' THEN
    UPDATE public.eco_actions 
    SET likes_count = (
      SELECT COUNT(*) FROM public.eco_action_likes 
      WHERE eco_action_id = COALESCE(NEW.eco_action_id, OLD.eco_action_id)
    )
    WHERE id = COALESCE(NEW.eco_action_id, OLD.eco_action_id);
  END IF;
  
  -- Update comments count
  IF TG_TABLE_NAME = 'eco_action_comments' THEN
    UPDATE public.eco_actions 
    SET comments_count = (
      SELECT COUNT(*) FROM public.eco_action_comments 
      WHERE eco_action_id = COALESCE(NEW.eco_action_id, OLD.eco_action_id)
    )
    WHERE id = COALESCE(NEW.eco_action_id, OLD.eco_action_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION award_user_points(
  target_user_id uuid,
  xp_points integer DEFAULT 0,
  eco_coins integer DEFAULT 0,
  reason text DEFAULT 'Activity reward'
)
RETURNS boolean AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    xp = xp + xp_points,
    eco_coins = eco_coins + eco_coins
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION award_eco_action_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points when eco action is verified
  IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
    PERFORM award_user_points(
      NEW.user_id,
      COALESCE(NEW.xp_reward, 50), -- Default 50 XP
      COALESCE(NEW.eco_coins_reward, 10) -- Default 10 EcoCoins
    );
    
    -- Create notification
    PERFORM create_notification(
      NEW.user_id,
      'eco_action_verified',
      'Eco Action Verified!',
      'Your eco action "' || NEW.title || '" has been verified. You earned ' || COALESCE(NEW.xp_reward, 50) || ' XP!',
      jsonb_build_object('eco_action_id', NEW.id, 'xp_earned', COALESCE(NEW.xp_reward, 50))
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;