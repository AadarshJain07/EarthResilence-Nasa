import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Coins, Heart, TreePine, Award, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useGameification } from '@/hooks/useGameification';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: 'eco_product' | 'donation' | 'reward';
  eco_coins_cost: number;
  image_url?: string;
  stock_quantity?: number;
  is_active: boolean;
}

interface Purchase {
  id: string;
  eco_coins_spent: number;
  status: string;
  created_at: string;
  item: MarketplaceItem;
}

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { ecoCoins, awardEcoCoins } = useGameification();
  const { toast } = useToast();

  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const mockItems: MarketplaceItem[] = [
    { id: '1', name: 'Reusable Water Bottle', description: 'High-quality stainless steel water bottle to reduce plastic waste', category: 'eco_product', eco_coins_cost: 150, stock_quantity: 50, is_active: true },
    { id: '2', name: 'Solar Power Bank', description: 'Portable solar charger for sustainable energy on-the-go', category: 'eco_product', eco_coins_cost: 300, stock_quantity: 25, is_active: true },
    { id: '3', name: 'Plant a Tree Donation', description: 'Fund tree planting initiatives in urban areas', category: 'donation', eco_coins_cost: 100, is_active: true },
    { id: '4', name: 'Ocean Cleanup Donation', description: 'Support ocean plastic cleanup projects', category: 'donation', eco_coins_cost: 200, is_active: true },
    { id: '5', name: 'Climate Champion Badge', description: 'Exclusive badge for profile customization', category: 'reward', eco_coins_cost: 75, is_active: true },
    { id: '6', name: 'Double XP Boost (24h)', description: 'Earn double XP from all activities for 24 hours', category: 'reward', eco_coins_cost: 120, is_active: true },
  ];

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('marketplace_items').select('*').eq('is_active', true);
      if (error) throw error;
      setItems(data.length > 0 ? (data as MarketplaceItem[]) : mockItems);
    } catch (err) {
      console.error('Error fetching items:', err);
      setItems(mockItems);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_purchases')
        .select('*, item:marketplace_items(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      if (!error && data) setPurchases(data as Purchase[]);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  const purchaseItem = async (item: MarketplaceItem) => {
    if (ecoCoins < item.eco_coins_cost) {
      return toast({ title: "Insufficient EcoCoins", description: `You need ${item.eco_coins_cost - ecoCoins} more EcoCoins.`, variant: "destructive" });
    }
    try {
      await awardEcoCoins(-item.eco_coins_cost, `Purchased: ${item.name}`);
      const mockPurchase: Purchase = {
        id: Date.now().toString(),
        eco_coins_spent: item.eco_coins_cost,
        status: 'completed',
        created_at: new Date().toISOString(),
        item,
      };
      setPurchases(prev => [mockPurchase, ...prev]);
      toast({ title: "Purchase Successful! 🎉", description: `You've successfully purchased ${item.name}!`, className: "border-secondary-glow bg-secondary-glow/10" });
      if (item.category === 'reward' && item.name.includes('XP Boost')) {
        toast({ title: "XP Boost Activated!", description: "You'll earn double XP for the next 24 hours!", className: "xp-glow" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Purchase Failed", description: "There was an error processing your purchase. Please try again.", variant: "destructive" });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchItems(), fetchPurchases()]);
      setLoading(false);
    };
    loadData();
  }, [profile]);

  const getCategoryIcon = (category: string) => {
    return category === 'eco_product' ? Package : category === 'donation' ? Heart : Award;
  };

  const getCategoryColor = (category: string) => {
    return category === 'eco_product' ? 'text-info' : category === 'donation' ? 'text-accent' : 'text-xp';
  };

  const categorizedItems = {
    eco_product: items.filter(i => i.category === 'eco_product'),
    donation: items.filter(i => i.category === 'donation'),
    reward: items.filter(i => i.category === 'reward'),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header & EcoCoins */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">EcoCoin Marketplace</h1>
            <p className="text-muted-foreground mt-2">Redeem your EcoCoins for sustainable products, donations, and rewards</p>
          </div>
          <Card className="data-point">
            <CardContent className="p-4 flex items-center gap-3">
              <Coins className="h-6 w-6 text-secondary-glow" />
              <div>
                <div className="text-2xl font-bold text-secondary-glow">{ecoCoins}</div>
                <div className="text-sm text-muted-foreground">EcoCoins</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
          </TabsList>

          {/* Shop */}
          <TabsContent value="shop" className="space-y-6">
            <Tabs defaultValue="eco_product" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="eco_product" className="flex items-center gap-2"><Package className="h-4 w-4" /> Eco Products</TabsTrigger>
                <TabsTrigger value="donation" className="flex items-center gap-2"><Heart className="h-4 w-4" /> Donations</TabsTrigger>
                <TabsTrigger value="reward" className="flex items-center gap-2"><Award className="h-4 w-4" /> Rewards</TabsTrigger>
              </TabsList>

              {Object.entries(categorizedItems).map(([category, categoryItems]) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map(item => {
                      const Icon = getCategoryIcon(item.category);
                      const canAfford = ecoCoins >= item.eco_coins_cost;
                      return (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                          <Card className={`data-point orbital-hover h-full ${!canAfford ? 'opacity-60' : ''}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <Icon className={`h-8 w-8 ${getCategoryColor(item.category)}`} />
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-secondary-glow">
                                    <Coins className="h-4 w-4" />
                                    <span className="font-bold">{item.eco_coins_cost}</span>
                                  </div>
                                  {item.stock_quantity && <div className="text-xs text-muted-foreground mt-1">{item.stock_quantity} in stock</div>}
                                </div>
                              </div>
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button className="w-full" onClick={() => purchaseItem(item)} disabled={!canAfford} variant={canAfford ? "secondary" : "outline"}>
                                <ShoppingCart className="h-4 w-4 mr-2" /> {canAfford ? 'Purchase' : 'Not Enough EcoCoins'}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Purchase History */}
          <TabsContent value="history" className="space-y-6">
            {purchases.length === 0 ? (
              <Card className="data-point text-center">
                <CardContent className="p-12">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
                  <p className="text-muted-foreground mb-4">Start shopping to support climate action and earn rewards!</p>
                  <Button variant="secondary" onClick={() => navigate('/marketplace')}>Browse Marketplace</Button>
                </CardContent>
              </Card>
            ) : (
              purchases.map(purchase => {
                const Icon = getCategoryIcon(purchase.item.category);
                return (
                  <Card key={purchase.id} className="data-point">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Icon className={`h-8 w-8 ${getCategoryColor(purchase.item.category)}`} />
                        <div>
                          <h4 className="font-semibold">{purchase.item.name}</h4>
                          <p className="text-sm text-muted-foreground">{new Date(purchase.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-secondary-glow">
                          <Coins className="h-4 w-4" />
                          <span className="font-bold">{purchase.eco_coins_spent}</span>
                        </div>
                        <Badge variant="outline" className="mt-1">{purchase.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {/* Earn More EcoCoins */}
        <Card className="data-point">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TreePine className="h-12 w-12 text-secondary-glow" />
              <div>
                <h3 className="text-lg font-semibold">Need More EcoCoins?</h3>
                <p className="text-muted-foreground">Complete eco-actions, games, and challenges to earn more!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/games')}>Play Games</Button>
              <Button variant="secondary" onClick={() => navigate('/community')}>Join Community</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Marketplace;
