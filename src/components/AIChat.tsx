// src/components/AIChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Loader2, TreePine, Lightbulb, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type Mode = 'citizen' | 'urban_planner' | 'ngo' | 'government_admin';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  typing?: boolean;
}

interface AIChatProps {
  mode?: Mode;
}

const AIChat: React.FC<AIChatProps> = ({ mode = 'citizen' }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage(mode);
    setMessages([{
      id: 'welcome',
      content: welcomeMessage,
      role: 'assistant',
      timestamp: new Date(),
    }]);
  }, [mode]);

  // Generate welcome text per mode
  const getWelcomeMessage = (userMode: Mode) => {
    const name = profile?.full_name || 'Climate Champion';
    switch (userMode) {
      case 'urban_planner':
        return `Hello ${name}! I'm your AI Climate Planning Assistant. Ask me about green infrastructure, climate resilience, and sustainable urban development.`;
      case 'ngo':
        return `Welcome ${name}! I'm your AI Community Engagement Assistant. Ask me about campaigns, community projects, or environmental programs.`;
      case 'government_admin':
        return `Greetings ${name}! I'm your AI Policy Advisory Assistant. Ask me about climate policies, regulations, or governance strategies.`;
      default:
        return `Hi ${name}! I'm your personal AI Climate Coach. Ask me about reducing your carbon footprint, sustainability tips, or climate knowledge.`;
    }
  };

  // Simulate AI response
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    const lower = userMessage.toLowerCase();

    // Citizen responses
    if (lower.includes('carbon') || lower.includes('reduce')) {
      return 'Try using public transport, switch to renewable energy, and reduce meat consumption. Small steps make a big difference!';
    }
    if (lower.includes('tree') || lower.includes('plant')) {
      return 'Plant native trees in your community. Track their growth for maximum CO2 absorption!';
    }

    // Urban planner
    if (mode === 'urban_planner' && (lower.includes('green') || lower.includes('infrastructure'))) {
      return 'Consider green roofs, urban forests, and transit-oriented development for sustainable city planning.';
    }

    // NGO
    if (mode === 'ngo' && (lower.includes('campaign') || lower.includes('community'))) {
      return 'Engage the local community with workshops, awareness campaigns, and social media outreach.';
    }

    // Government admin
    if (mode === 'government_admin' && (lower.includes('policy') || lower.includes('regulation'))) {
      return 'Focus on carbon pricing, net-zero building standards, and electrification of public transport.';
    }

    return "That's an interesting point! I suggest exploring sustainable actions and local initiatives to make a real impact.";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      typing: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await generateAIResponse(userMessage.content);
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== 'typing');
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        }];
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'AI Error',
        description: 'Something went wrong. Try again!',
        variant: 'destructive',
      });
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'urban_planner': return '🏗️';
      case 'ngo': return '🌱';
      case 'government_admin': return '🏛️';
      default: return '🌍';
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'urban_planner': return 'Climate Planning Assistant';
      case 'ngo': return 'Community Engagement Assistant';
      case 'government_admin': return 'Policy Advisory Assistant';
      default: return 'Personal Climate Coach';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary-glow/10">
            <Bot className="h-5 w-5 text-primary-glow" />
          </div>
          <div>
            <span className="text-lg">{getModeTitle()}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg">{getModeIcon()}</span>
              <Badge variant="outline" className="text-xs">AI Powered</Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex-1 overflow-y-auto space-y-4 max-h-96 pr-2">
          <AnimatePresence>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-primary-glow/10">
                    <AvatarFallback><Bot className="h-4 w-4 text-primary-glow" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`
                  max-w-[80%] p-3 rounded-lg text-sm
                  ${m.role === 'user' ? 'bg-primary-glow/20 text-foreground ml-auto' : 'bg-muted border border-border/20'}
                `}>
                  {m.typing ? (
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-glow rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-glow rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-primary-glow rounded-full animate-bounce delay-300"></div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
                {m.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 pt-4 border-t border-border/20">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about climate action, sustainability tips..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2">
          <Button variant="outline" size="sm" onClick={() => setInputValue('How can I reduce my carbon footprint?')} disabled={isLoading}>
            <TreePine className="h-3 w-3 mr-1" /> Carbon Tips
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInputValue('What are the latest climate policies I should know about?')} disabled={isLoading}>
            <Lightbulb className="h-3 w-3 mr-1" /> Policy Updates
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInputValue('Suggest eco-friendly actions for my city')} disabled={isLoading}>
            <Sparkles className="h-3 w-3 mr-1" /> Local Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
