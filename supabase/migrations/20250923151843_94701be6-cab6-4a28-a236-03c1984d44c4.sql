-- Create enhanced profiles table for user management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'citizen' CHECK (role IN ('citizen', 'urban_planner', 'ngo', 'government_admin')),
ADD COLUMN IF NOT EXISTS resilience_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS eco_coins integer DEFAULT 0;

-- Create user_sessions table for tracking game sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL, -- 'dashboard', 'simulation', 'game', 'community'
  duration_minutes integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  eco_coins_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create eco_actions table for community posts
CREATE TABLE IF NOT EXISTS public.eco_actions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  action_type text NOT NULL, -- 'tree_planting', 'solar_installation', 'composting', etc.
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  xp_reward integer DEFAULT 0,
  eco_coins_reward integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone
);

-- Create eco_action_likes table
CREATE TABLE IF NOT EXISTS public.eco_action_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  eco_action_id uuid REFERENCES public.eco_actions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, eco_action_id)
);

-- Create eco_action_comments table
CREATE TABLE IF NOT EXISTS public.eco_action_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  eco_action_id uuid REFERENCES public.eco_actions(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create community_groups table
CREATE TABLE IF NOT EXISTS public.community_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  avatar_url text,
  member_count integer DEFAULT 0,
  admin_id uuid REFERENCES public.profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create climate_simulations table
CREATE TABLE IF NOT EXISTS public.climate_simulations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  city text NOT NULL,
  interventions jsonb DEFAULT '[]'::jsonb, -- Store simulation data
  results jsonb DEFAULT '{}'::jsonb, -- Store simulation results
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL, -- 'eco_product', 'donation', 'reward'
  eco_coins_cost integer NOT NULL,
  image_url text,
  stock_quantity integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create marketplace_purchases table
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.marketplace_items(id),
  eco_coins_spent integer NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);

-- Create city_data table for NASA/climate data
CREATE TABLE IF NOT EXISTS public.city_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name text NOT NULL,
  country text,
  latitude numeric,
  longitude numeric,
  aqi integer,
  temperature numeric,
  humidity numeric,
  vegetation_cover numeric,
  water_quality numeric,
  urban_growth numeric,
  data_source text DEFAULT 'nasa', -- 'nasa', 'ghsl', 'wri'
  recorded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create leaderboards table for global tracking
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  leaderboard_type text NOT NULL, -- 'global', 'city', 'group'
  reference_id uuid, -- city_id or group_id
  position integer NOT NULL,
  score integer NOT NULL,
  period text DEFAULT 'monthly', -- 'weekly', 'monthly', 'yearly', 'all_time'
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_action_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_action_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for eco_actions
CREATE POLICY "Anyone can view verified eco actions" ON public.eco_actions
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id);
CREATE POLICY "Users can create eco actions" ON public.eco_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own eco actions" ON public.eco_actions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all eco actions" ON public.eco_actions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'government_admin' OR is_admin = true)));

-- RLS Policies for eco_action_likes
CREATE POLICY "Anyone can view likes" ON public.eco_action_likes
  FOR SELECT USING (true);
CREATE POLICY "Users can like eco actions" ON public.eco_action_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike their likes" ON public.eco_action_likes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for eco_action_comments
CREATE POLICY "Anyone can view comments" ON public.eco_action_comments
  FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.eco_action_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their comments" ON public.eco_action_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for community_groups
CREATE POLICY "Anyone can view active groups" ON public.community_groups
  FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create groups" ON public.community_groups
  FOR INSERT WITH CHECK (auth.uid() = admin_id);
CREATE POLICY "Group admins can update groups" ON public.community_groups
  FOR UPDATE USING (auth.uid() = admin_id);

-- RLS Policies for group_members
CREATE POLICY "Users can view group memberships" ON public.group_members
  FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for climate_simulations
CREATE POLICY "Users can view their own simulations" ON public.climate_simulations
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create simulations" ON public.climate_simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their simulations" ON public.climate_simulations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for marketplace
CREATE POLICY "Anyone can view active marketplace items" ON public.marketplace_items
  FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view their purchases" ON public.marketplace_purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can make purchases" ON public.marketplace_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for city_data
CREATE POLICY "Anyone can view city data" ON public.city_data
  FOR SELECT USING (true);

-- RLS Policies for leaderboards
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards
  FOR SELECT USING (true);

-- Create triggers for updating counters
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER eco_action_likes_count_trigger
  AFTER INSERT OR DELETE ON public.eco_action_likes
  FOR EACH ROW EXECUTE FUNCTION update_eco_action_counts();

CREATE TRIGGER eco_action_comments_count_trigger
  AFTER INSERT OR DELETE ON public.eco_action_comments
  FOR EACH ROW EXECUTE FUNCTION update_eco_action_counts();

-- Create function to award XP and EcoCoins
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for awarding points on eco action verification
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER eco_action_verification_trigger
  AFTER UPDATE ON public.eco_actions
  FOR EACH ROW EXECUTE FUNCTION award_eco_action_points();