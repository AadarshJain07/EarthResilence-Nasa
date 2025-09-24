import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Trophy,
  Star,
  Camera,
  Crown,
  Zap,
  Globe,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EcoActionCard from '@/components/EcoActionCard';
import CreateEcoAction from '@/components/CreateEcoAction';

const Community = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [selectedTab, setSelectedTab] = useState('feed');
  const [ecoActions, setEcoActions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch eco actions
  const fetchEcoActions = async () => {
    try {
      const { data, error } = await supabase
        .from('eco_actions')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEcoActions(data || mockEcoActions);
    } catch (err) {
      console.error('Error fetching eco actions:', err);
      setEcoActions(mockEcoActions);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, xp, level')
        .order('xp', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted = data.map((user, idx) => ({
        rank: idx + 1,
        name: user.full_name || 'Anonymous',
        xp: user.xp,
        avatar: user.avatar_url,
        badge: idx === 0 ? 'legendary' : idx === 1 ? 'epic' : idx === 2 ? 'rare' : 'common'
      }));

      setLeaderboard(formatted);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard(mockLeaderboard);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchEcoActions(), fetchLeaderboard()]);
      setLoading(false);
    };
    load();
  }, []);

  const mockEcoActions = [
    { id: 1, user: 'Sarah Green', avatar: '/api/placeholder/40/40', action: 'Planted 5 trees in Central Park', image: '/api/placeholder/300/200', xp: 50, likes: 24, comments: 8, time: '2 hours ago', verified: true },
    { id: 2, user: 'Mike Climate', avatar: '/api/placeholder/40/40', action: 'Started community composting program', image: '/api/placeholder/300/200', xp: 100, likes: 45, comments: 12, time: '5 hours ago', verified: true },
    { id: 3, user: 'Emma Sustainable', avatar: '/api/placeholder/40/40', action: 'Solar panel installation completed', image: '/api/placeholder/300/200', xp: 150, likes: 67, comments: 15, time: '1 day ago', verified: true },
  ];

  const mockLeaderboard = [
    { rank: 1, name: 'Climate Champion', xp: 15847, avatar: '/api/placeholder/40/40', badge: 'legendary' },
    { rank: 2, name: 'Eco Warrior', xp: 12350, avatar: '/api/placeholder/40/40', badge: 'epic' },
    { rank: 3, name: 'Green Guardian', xp: 9876, avatar: '/api/placeholder/40/40', badge: 'rare' },
    { rank: 4, name: 'Earth Protector', xp: 8543, avatar: '/api/placeholder/40/40', badge: 'common' },
    { rank: 5, name: 'Sustainability Pro', xp: 7821, avatar: '/api/placeholder/40/40', badge: 'rare' },
  ];

  const challenges = [
    { id: 1, title: 'Green Commute Week', description: 'Use eco-friendly transport for 7 days', participants: 234, xpReward: 200, deadline: '5 days left', difficulty: 'Medium' },
    { id: 2, title: 'Zero Waste Challenge', description: 'Eliminate single-use plastics for a month', participants: 156, xpReward: 500, deadline: '12 days left', difficulty: 'Hard' },
    { id: 3, title: 'Energy Saver', description: 'Reduce electricity usage by 20%', participants: 89, xpReward: 150, deadline: '3 days left', difficulty: 'Easy' },
  ];

  const groups = [
    { id: 1, name: 'Mumbai Climate Heroes', members: 1247, avatar: '/api/placeholder/60/60', description: 'Working together for a sustainable Mumbai', category: 'City Group' },
    { id: 2, name: 'Solar Power Enthusiasts', members: 834, avatar: '/api/placeholder/60/60', description: 'Promoting renewable energy adoption', category: 'Technology' },
    { id: 3, name: 'Urban Gardeners', members: 592, avatar: '/api/placeholder/60/60', description: 'Growing green spaces in cities', category: 'Environment' },
  ];

  const getRankIcon = (rank: number) => {
    switch(rank){
      case 1: return <Crown className="h-5 w-5 text-xp" />;
      case 2: return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch(badge){
      case 'legendary': return 'text-badge border-badge bg-badge/10';
      case 'epic': return 'text-xp border-xp bg-xp/10';
      case 'rare': return 'text-info border-info bg-info/10';
      default: return 'text-secondary border-secondary bg-secondary/10';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-2">
            Climate Community
          </h1>
          <p className="text-muted-foreground">
            Connect, share, and build a sustainable future together
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, value: '12.5K', label: 'Active Members', color: 'text-primary-glow' },
            { icon: Globe, value: '45K', label: 'Eco Actions', color: 'text-secondary-glow' },
            { icon: Zap, value: '2.3M', label: 'XP Earned', color: 'text-accent' },
            { icon: Trophy, value: '156', label: 'Cities Joined', color: 'text-xp' },
          ].map((stat, i) => (
            <Card key={i} className="data-point text-center">
              <CardContent className="p-4">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <h3 className="text-lg font-bold">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Eco Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          {/* Feed */}
          <TabsContent value="feed" className="space-y-6">
            <CreateEcoAction onActionCreated={fetchEcoActions} />
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-glow" />
                <p className="text-muted-foreground">Loading eco actions...</p>
              </div>
            ) : ecoActions.length === 0 ? (
              <Card className="data-point text-center">
                <CardContent className="p-12">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Eco Actions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your climate action with the community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {ecoActions.map((action) => (
                  <EcoActionCard key={action.id} action={action} onUpdate={fetchEcoActions} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="data-point">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-xp" /> Top Climate Champions
                </CardTitle>
                <CardDescription>This month's most active community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                          <span className="font-bold text-lg">#{user.rank}</span>
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                        </div>
                      </div>
                      <Badge className={getBadgeColor(user.badge)}>{user.badge}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="data-point orbital-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge variant={challenge.difficulty === 'Hard' ? 'destructive' : challenge.difficulty === 'Medium' ? 'secondary' : 'outline'}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-semibold">{challenge.participants}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reward</span>
                        <Badge variant="outline" className="xp-glow">{challenge.xpReward} XP</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deadline</span>
                        <span className="text-accent font-semibold">{challenge.deadline}</span>
                      </div>
                      <Button className="w-full" variant="secondary">Join Challenge</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="data-point orbital-hover">
                  <CardContent className="p-6 text-center space-y-4">
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <Badge variant="outline" className="mb-2">{group.category}</Badge>
                      <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                      <p className="text-sm font-medium">{group.members.toLocaleString()} members</p>
                    </div>
                    <Button variant="secondary" className="w-full flex justify-center items-center gap-2">
                      <Users className="h-4 w-4" /> Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;
