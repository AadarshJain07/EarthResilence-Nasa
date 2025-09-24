import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Recycle, 
  Brain, 
  TreePine, 
  Building, 
  Trophy,
  Star,
  Timer,
  Play,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameification } from '@/hooks/useGameification';
import { useAuth } from '@/hooks/useAuth';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  ecoCoinsReward: number;
  timeLimit: number;
  color: string;
}

const WasteSortingGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { awardXP, awardEcoCoins } = useGameification();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<{name: string, category: string, emoji: string} | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const categories = [
    { id: 'plastic', name: 'Plastic', color: 'bg-blue-500' },
    { id: 'paper', name: 'Paper', color: 'bg-green-500' },
    { id: 'organic', name: 'Organic', color: 'bg-yellow-500' },
    { id: 'electronic', name: 'Electronic', color: 'bg-purple-500' },
  ];

  const items = [
    { name: 'Plastic Bottle', category: 'plastic', emoji: '🍼' },
    { name: 'Newspaper', category: 'paper', emoji: '📰' },
    { name: 'Apple Core', category: 'organic', emoji: '🍎' },
    { name: 'Old Phone', category: 'electronic', emoji: '📱' },
    { name: 'Cardboard Box', category: 'paper', emoji: '📦' },
    { name: 'Banana Peel', category: 'organic', emoji: '🍌' },
    { name: 'Laptop', category: 'electronic', emoji: '💻' },
    { name: 'Plastic Bag', category: 'plastic', emoji: '🛍️' },
  ];

  const generateRandomItem = () => items[Math.floor(Math.random() * items.length)];

  useEffect(() => {
    let timer: NodeJS.Timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPlaying(false);
            setGameComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setCurrentItem(generateRandomItem());
    setGameComplete(false);
  };

  const sortItem = (categoryId: string) => {
    if (!isPlaying || !currentItem) return;
    if (categoryId === currentItem.category) setScore(prev => prev + 10);
    else setScore(prev => Math.max(0, prev - 5));
    setCurrentItem(generateRandomItem());
  };

  const completeGame = async () => {
    const finalXP = Math.floor(score / 2);
    const finalCoins = Math.floor(score / 10);
    if (finalXP > 0) await awardXP(finalXP, `Waste Sorting: ${score} points`);
    if (finalCoins > 0) await awardEcoCoins(finalCoins, `Waste Sorting rewards`);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Waste Sorting Challenge</h3>
          <p className="text-muted-foreground">Sort items into the correct recycling categories</p>
        </div>
        <Button onClick={onComplete} variant="outline">Back to Games</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="data-point text-center">
          <CardContent>
            <Trophy className="h-6 w-6 mx-auto mb-2 text-xp" />
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>

        <Card className="data-point text-center">
          <CardContent>
            <Timer className="h-6 w-6 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>

        <Card className="data-point text-center">
          <CardContent>
            <Star className="h-6 w-6 mx-auto mb-2 text-secondary-glow" />
            <div className="text-2xl font-bold">{Math.floor(score / 2)}</div>
            <div className="text-sm text-muted-foreground">XP</div>
          </CardContent>
        </Card>
      </div>

      {!isPlaying && !gameComplete && (
        <Card className="data-point text-center">
          <CardContent className="p-8">
            <Recycle className="h-16 w-16 mx-auto mb-4 text-secondary-glow" />
            <h4 className="text-lg font-semibold mb-2">Ready to Sort?</h4>
            <p className="text-muted-foreground mb-4">
              Sort waste items into the correct recycling categories. +10 points for correct sorts, -5 for mistakes!
            </p>
            <Button onClick={startGame} className="orbital-hover">
              <Play className="h-4 w-4 mr-2" /> Start Game
            </Button>
          </CardContent>
        </Card>
      )}

      {isPlaying && currentItem && (
        <Card className="data-point text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">{currentItem.emoji}</div>
            <h4 className="text-xl font-bold mb-2">{currentItem.name}</h4>
            <p className="text-muted-foreground mb-6">Where does this belong?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  onClick={() => sortItem(cat.id)}
                  className={`h-20 ${cat.color} hover:opacity-80`}
                  variant="secondary"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {gameComplete && (
        <Card className="data-point text-center">
          <CardContent className="p-8">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-xp" />
            <h4 className="text-xl font-bold mb-2">Game Complete!</h4>
            <p className="text-muted-foreground mb-4">Final Score: {score} points</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={startGame} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" /> Play Again
              </Button>
              <Button onClick={completeGame} className="orbital-hover">
                Collect Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Games: React.FC = () => {
  const { profile } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games: Game[] = [
    { id: 'waste-sorting', title: 'Waste Sorting Challenge', description: 'Sort waste items into correct recycling categories', icon: Recycle, difficulty: 'Easy', xpReward: 25, ecoCoinsReward: 5, timeLimit: 60, color: 'text-secondary-glow' },
    { id: 'climate-quiz', title: 'Climate Knowledge Quiz', description: 'Test your knowledge about climate science and solutions', icon: Brain, difficulty: 'Medium', xpReward: 50, ecoCoinsReward: 10, timeLimit: 180, color: 'text-info' },
    { id: 'eco-runner', title: 'Eco Runner', description: 'Navigate through urban environments collecting eco-points', icon: TreePine, difficulty: 'Easy', xpReward: 30, ecoCoinsReward: 8, timeLimit: 120, color: 'text-accent' },
    { id: 'city-builder', title: 'Climate City Builder', description: 'Design a sustainable city with optimal resource management', icon: Building, difficulty: 'Hard', xpReward: 100, ecoCoinsReward: 25, timeLimit: 300, color: 'text-xp' },
  ];

  if (selectedGame === 'waste-sorting') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <WasteSortingGame onComplete={() => setSelectedGame(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-2">
            Climate Games Hub
          </h1>
          <p className="text-muted-foreground">Learn about climate action through fun, interactive games</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="data-point text-center">
            <CardContent>
              <Star className="h-6 w-6 mx-auto mb-2 text-xp" />
              <h3 className="text-lg font-bold">{profile?.level || 1}</h3>
              <p className="text-xs text-muted-foreground">Level</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent>
              <Trophy className="h-6 w-6 mx-auto mb-2 text-xp" />
              <h3 className="text-lg font-bold">{profile?.xp || 0}</h3>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent>
              <TreePine className="h-6 w-6 mx-auto mb-2 text-secondary-glow" />
              <h3 className="text-lg font-bold">{profile?.eco_coins || 0}</h3>
              <p className="text-xs text-muted-foreground">EcoCoins</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent>
              <Gamepad2 className="h-6 w-6 mx-auto mb-2 text-info" />
              <h3 className="text-lg font-bold">0</h3>
              <p className="text-xs text-muted-foreground">Games Played</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map(game => {
            const Icon = game.icon;
            return (
              <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="data-point orbital-hover h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className={`h-8 w-8 ${game.color}`} />
                      <Badge variant={
                        game.difficulty === 'Easy' ? 'secondary' :
                        game.difficulty === 'Medium' ? 'outline' : 'destructive'
                      }>{game.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rewards</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="xp-glow">+{game.xpReward} XP</Badge>
                        <Badge variant="outline" className="text-secondary-glow border-secondary-glow">+{game.ecoCoinsReward} EcoCoins</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time Limit</span>
                      <span className="font-medium">{Math.floor(game.timeLimit/60)}:{(game.timeLimit%60).toString().padStart(2,'0')}</span>
                    </div>
                    <Button className="w-full" variant="secondary" onClick={() => setSelectedGame(game.id)}>
                      <Play className="h-4 w-4 mr-2" /> Play Game
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Games;
