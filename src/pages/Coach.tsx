import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Mic, MicOff, Lightbulb, Target, Map, Zap, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  type: 'bot' | 'user';
  message: string;
  time: string;
}

interface Mission {
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

const Coach = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'citizen' | 'planner' | 'government'>('citizen');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'bot',
      message: 'Hello! I\'m your AI Climate Coach. I can help you with eco-tips, urban planning insights, or policy guidance. What would you like to explore today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [dailyMissions, setDailyMissions] = useState<Mission[]>([
    { title: 'Green Commute Challenge', description: 'Use public transport or bike today', xp: 25, completed: false },
    { title: 'Energy Saver', description: 'Reduce electricity usage by 10%', xp: 30, completed: true },
    { title: 'Community Action', description: 'Share an eco-tip with friends', xp: 20, completed: false },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const coachModes = [
    { id: 'citizen', name: 'Citizen Mode', icon: User, description: 'Personal eco-tips and daily missions', color: 'text-secondary-glow' },
    { id: 'planner', name: 'Urban Planner', icon: Map, description: 'Zoning and greenspace recommendations', color: 'text-primary-glow' },
    { id: 'government', name: 'Government', icon: Zap, description: 'Policy guidance and impact analysis', color: 'text-accent' },
  ];

  const quickActions = [
    { label: 'Daily eco tips', icon: Lightbulb },
    { label: "Check my city's AQI", icon: Target },
    { label: 'Plan green commute', icon: Map },
    { label: 'Energy saving guide', icon: Zap },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
    const msg = userMessage.toLowerCase();
    if (msg.includes('eco tip') || msg.includes('tips')) return '🌱 Today\'s eco tip: Use a reusable water bottle and avoid single-use plastics!';
    if (msg.includes('aqi')) return '🌫️ Current AQI in your city is 120 (Moderate). Consider outdoor activity wisely.';
    if (msg.includes('green commute')) return '🚲 Try biking or using public transport today to reduce emissions!';
    if (msg.includes('energy')) return '💡 Switch to LED bulbs and turn off unused devices to save energy!';
    if (msg.includes('policy')) return '🏛️ Explore evidence-based climate policies for your region.';
    if (msg.includes('tree') || msg.includes('plant')) return '🌳 Plant native trees in your community to maximize impact.';
    return '🤔 I can help with eco-tips, city insights, or daily missions. Ask me something specific!';
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      type: 'user',
      message: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');

    const typingMsg: ChatMessage = { type: 'bot', message: 'AI is typing...', time: '' };
    setChatHistory(prev => [...prev, typingMsg]);

    try {
      const response = await generateAIResponse(userMsg.message);
      setChatHistory(prev => {
        const withoutTyping = prev.filter(m => m.message !== 'AI is typing...');
        return [...withoutTyping, { type: 'bot', message: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      });
    } catch (err) {
      toast({
        title: 'AI Error',
        description: 'Something went wrong. Try again.',
        variant: 'destructive',
      });
      setChatHistory(prev => prev.filter(m => m.message !== 'AI is typing...'));
    }
  };

  const toggleVoice = () => setIsListening(!isListening);
  const toggleMissionCompletion = (idx: number) => setDailyMissions(prev => {
    const copy = [...prev]; copy[idx].completed = !copy[idx].completed; return copy;
  });

  const handleQuickAction = async (label: string) => {
    const quickResponseMap: Record<string, string> = {
      'Daily eco tips': '🌱 Reduce single-use plastic today!',
      "Check my city's AQI": '🌫️ AQI today: 120 (Moderate).',
      'Plan green commute': '🚲 Bike or take public transport for one trip.',
      'Energy saving guide': '💡 Unplug devices and switch to LED bulbs.',
    };
    const botMsg: ChatMessage = { type: 'bot', message: quickResponseMap[label] || 'Action completed!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory(prev => [...prev, botMsg]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-2">
            AI Climate Coach
          </h1>
          <p className="text-muted-foreground">Your personal AI assistant for climate-smart decisions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="data-point">
              <CardHeader>
                <CardTitle>Coach Mode</CardTitle>
                <CardDescription>Select how you want to interact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {coachModes.map(mode => {
                  const Icon = mode.icon;
                  return (
                    <Button
                      key={mode.id}
                      variant={selectedMode === mode.id ? 'secondary' : 'ghost'}
                      className={`w-full justify-start gap-3 ${selectedMode === mode.id ? 'bg-primary/20 text-primary-glow shadow-glow' : ''}`}
                      onClick={() => setSelectedMode(mode.id)}
                    >
                      <Icon className={`h-5 w-5 ${mode.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="data-point">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-secondary-glow" /> Daily Missions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailyMissions.map((mission, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border transition-all ${mission.completed ? 'border-success/20 bg-success/5' : 'border-border/20 bg-muted/10'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm">{mission.title}</h4>
                        <p className="text-xs text-muted-foreground">{mission.description}</p>
                      </div>
                      <Badge
                        variant={mission.completed ? 'secondary' : 'outline'}
                        className={mission.completed ? 'text-success cursor-pointer' : 'xp-glow cursor-pointer'}
                        onClick={() => toggleMissionCompletion(idx)}
                      >
                        {mission.completed ? '✓' : `+${mission.xp} XP`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="data-point">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Button key={idx} variant="ghost" className="w-full justify-start gap-3" onClick={() => handleQuickAction(action.label)}>
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="data-point h-[600px] flex flex-col">
              <CardHeader className="border-b border-border/20 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20">
                    <Bot className="h-5 w-5 text-primary-glow" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    AI Climate Coach
                    <Badge variant="outline" className="animate-pulse-glow"><Sparkles className="h-3 w-3 mr-1" /> Online</Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedMode === 'citizen' && 'Personal eco assistant'}
                    {selectedMode === 'planner' && 'Urban planning advisor'}
                    {selectedMode === 'government' && 'Policy guidance expert'}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
                {chatHistory.map((chat, idx) => {
                  const avatarBg = chat.type === 'user' ? 'bg-secondary/20' : 'bg-primary/20';
                  return (
                    <div key={idx} className={`flex gap-3 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className={avatarBg}>
                          {chat.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary-glow" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 space-y-2 ${chat.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${chat.type === 'user' ? 'bg-primary/20 ml-auto text-right' : 'bg-muted/30'}`}>
                          <p className="text-sm whitespace-pre-line">{chat.message}</p>
                          {chat.time && <span className="text-xs text-muted-foreground mt-1 block">{chat.time}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </CardContent>

              <div className="border-t border-border/20 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me about climate actions, city data, or tips..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={toggleVoice} className={isListening ? 'text-accent border-accent' : ''}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  💡 Try: "What's my city's air quality?" or "Give me daily eco tips"
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Coach;
