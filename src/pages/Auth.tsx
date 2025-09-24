import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Globe, Users, Building, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'citizen' as const
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      setSuccessMsg('Successfully signed in!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign in failed. Check credentials.');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await signUp(signUpData.email, signUpData.password, {
        full_name: signUpData.full_name,
        role: signUpData.role
      });
      setSuccessMsg('Account created successfully! Please sign in.');
      setSignUpData({ email: '', password: '', full_name: '', role: 'citizen' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed. Try again.');
    }
    setIsLoading(false);
  };

  const roleIcons = { citizen: Users, urban_planner: Building, ngo: Globe, government_admin: Shield };
  const roles = [
    { value: 'citizen', label: 'Citizen', description: 'Individual climate action and community engagement', color: 'text-secondary-glow' },
    { value: 'urban_planner', label: 'Urban Planner', description: 'Professional city planning and development insights', color: 'text-info' },
    { value: 'ngo', label: 'NGO Representative', description: 'Non-profit organization and community leadership', color: 'text-accent' },
    { value: 'government_admin', label: 'Government Admin', description: 'Policy implementation and administrative oversight', color: 'text-primary-glow' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-glow/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-glow/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-primary-glow" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
              Earth Resilience
            </span>
          </div>
          <p className="text-muted-foreground">Join the global movement for climate-smart cities</p>
        </div>

        <Card className="glassmorphism border-border/20">
          <CardHeader className="text-center">
            <CardTitle>Welcome to the Future</CardTitle>
            <CardDescription>Sign in or create your account to start building climate resilience</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && <Badge variant="destructive" className="mb-4">{errorMsg}</Badge>}
            {successMsg && <Badge variant="secondary" className="mb-4">{successMsg}</Badge>}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Form */}
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading || loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={isLoading || loading}
                    />
                  </div>
                  <Button type="submit" className="w-full orbital-hover" disabled={isLoading || loading}>
                    {isLoading || loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing In...</> : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signUpData.full_name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                      disabled={isLoading || loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={isLoading || loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a strong password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={isLoading || loading}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-role">Your Role</Label>
                    <Select
                      value={signUpData.role}
                      onValueChange={(value: any) => setSignUpData(prev => ({ ...prev, role: value }))}
                      disabled={isLoading || loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => {
                          const Icon = roleIcons[role.value as keyof typeof roleIcons];
                          return (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${role.color}`} />
                                <div>
                                  <div className="font-medium">{role.label}</div>
                                  <div className="text-xs text-muted-foreground">{role.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full orbital-hover" disabled={isLoading || loading}>
                    {isLoading || loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating Account...</> : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Badge variant="outline" className="text-xs">🌍 Join climate champions worldwide</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to help build a more resilient planet for future generations.
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
