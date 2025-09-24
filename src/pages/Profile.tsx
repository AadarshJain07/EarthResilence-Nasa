import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Star, Trophy, Coins, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGameification } from '@/hooks/useGameification';

const Profile = () => {
  const { profile, signOut } = useAuth();
  const { level, xp, ecoCoins, badges } = useGameification();
  
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Profile Header */}
        <Card className="data-point hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-28 w-28">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-3xl">{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
                  {profile.full_name}
                </h1>
                <Badge variant="outline" className="mt-2">
                  {profile.role.replace('_', ' ')}
                </Badge>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition">
                    <Star className="h-6 w-6 mx-auto mb-1 text-xp animate-pulse" />
                    <div className="font-bold text-lg">Level {level}</div>
                    <div className="text-xs text-muted-foreground">{xp} XP</div>
                    <div className="w-full h-2 bg-border rounded-full mt-2">
                      <div className="h-2 bg-primary-glow rounded-full transition-all" style={{ width: `${(xp % 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition">
                    <Coins className="h-6 w-6 mx-auto mb-1 text-secondary-glow animate-bounce" />
                    <div className="font-bold text-lg">{ecoCoins}</div>
                    <div className="text-xs text-muted-foreground">EcoCoins</div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition">
                    <Trophy className="h-6 w-6 mx-auto mb-1 text-accent animate-spin-slow" />
                    <div className="font-bold text-lg">{badges.length}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={signOut} className="mt-4 md:mt-0 flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badge Carousel */}
        {badges.length > 0 && (
          <Card className="data-point">
            <CardHeader>
              <CardTitle>My Achievements</CardTitle>
              <CardDescription>Hover badges to see details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto py-4">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-24 h-24 rounded-xl bg-muted hover:scale-110 transition-transform duration-300 flex flex-col items-center justify-center cursor-pointer shadow hover:shadow-lg"
                  >
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={badge.icon_url} />
                      <AvatarFallback>{badge.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Profile;
