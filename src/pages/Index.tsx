import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EarthVisualization from '@/components/EarthVisualization';
import Navigation from '@/components/Navigation';
import {
  Globe,
  Satellite,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Target,
  Shield,
  TreePine,
  Waves,
  Wind,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const impactStats = [
    { value: '156', label: 'Cities Monitored', icon: Globe },
    { value: '2.3M', label: 'Data Points Daily', icon: Satellite },
    { value: '45K', label: 'Climate Actions', icon: Target },
    { value: '12K', label: 'Active Users', icon: Users },
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'NASA-Powered Dashboards',
      description: 'Real-time Earth observation data from MODIS, Landsat, and GHSL satellites for comprehensive city climate analysis.',
      color: 'text-primary-glow',
    },
    {
      icon: Zap,
      title: 'AI Climate Coach',
      description: 'Personalized recommendations powered by machine learning and comprehensive environmental datasets.',
      color: 'text-accent',
    },
    {
      icon: Users,
      title: 'Gamified Community',
      description: 'Earn XP, badges, and EcoCoins while building climate resilience with a global community of changemakers.',
      color: 'text-secondary-glow',
    },
    {
      icon: Shield,
      title: 'Urban Simulation',
      description: 'Digital twin cities for testing climate interventions before implementation using advanced modeling.',
      color: 'text-info',
    },
  ];

  const problemPoints = [
    { icon: Wind, stat: '198 AQI', problem: 'Mumbai air quality exceeds safe limits', impact: 'Affecting 20M+ residents daily' },
    { icon: Waves, stat: '+2.5°C', problem: 'Urban heat islands intensifying', impact: 'Energy demand up 40% in summers' },
    { icon: TreePine, stat: '-25%', problem: 'Green cover declining rapidly', impact: 'Biodiversity loss accelerating' },
  ];

  const solutionHighlights = [
    'Real-time satellite monitoring',
    'AI-powered interventions',
    'Community-driven actions',
    'Policy simulation tools',
    'Gamified engagement',
    'Global impact tracking',
  ];

  // Animate impact stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % impactStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <EarthVisualization showDataLayers interactive className="opacity-60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/80 z-10" />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <Badge variant="outline" className="animate-pulse-glow px-4 py-2 inline-flex items-center justify-center gap-2">
              <Satellite className="h-4 w-4" />
              Powered by NASA Earth Data + AI
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-glow via-secondary-glow to-accent-glow bg-clip-text text-transparent">
                Earth Resilience
              </span>
              <br />
              <span className="text-foreground">Dashboard</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI + NASA Earth Data → Building Climate-Smart, Resilient Cities for People & Planet
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="group px-8 py-4 text-lg font-semibold orbital-hover flex items-center justify-center gap-2">
                  Explore Your City's Resilience
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link to="/coach">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-primary-glow/30 hover:bg-primary-glow/10">
                  Try AI Coach
                </Button>
              </Link>
            </div>

            <motion.div
              key={currentStat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 glassmorphism px-6 py-3 rounded-full"
            >
              {React.createElement(impactStats[currentStat].icon, { className: 'h-5 w-5 text-secondary-glow' })}
              <span className="text-2xl font-bold xp-glow">{impactStats[currentStat].value}</span>
              <span className="text-muted-foreground">{impactStats[currentStat].label}</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Climate Crisis Demands
              <span className="bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent"> Urgent Action</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cities generate 70% of global emissions while housing 55% of the world's population. Immediate science-backed interventions are essential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problemPoints.map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.2 }}>
                <Card className="data-point text-center h-full border-destructive/20">
                  <CardContent className="p-8">
                    <point.icon className="h-12 w-12 mx-auto mb-4 text-destructive" />
                    <h3 className="text-3xl font-bold text-destructive mb-2">{point.stat}</h3>
                    <h4 className="text-lg font-semibold mb-3">{point.problem}</h4>
                    <p className="text-muted-foreground">{point.impact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NASA Data Section */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 inline-flex items-center gap-2">
              <Satellite className="h-4 w-4" /> NASA Earth Observation Data
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Powered by
              <span className="bg-gradient-to-r from-primary-glow to-info bg-clip-text text-transparent"> Space-Grade Intelligence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Real-time data from NASA, Copernicus GHSL, and WRI provides unprecedented insights into urban climate dynamics.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {impactStats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="data-point text-center orbital-hover">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary-glow" />
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Complete Climate Resilience
              <span className="bg-gradient-to-r from-secondary-glow to-accent bg-clip-text text-transparent"> Platform</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From data visualization to community action, everything you need to build climate-smart cities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: i * 0.2 }}>
                <Card className="data-point h-full orbital-hover">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Solution Highlights */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h3 className="text-2xl font-bold mb-8">Why Choose Earth Resilience Dashboard?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {solutionHighlights.map((highlight, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex items-center gap-2 p-3 glassmorphism rounded-lg">
                  <CheckCircle className="h-5 w-5 text-secondary-glow flex-shrink-0" />
                  <span className="text-sm font-medium">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Build a
              <span className="bg-gradient-to-r from-secondary-glow to-accent-glow bg-clip-text text-transparent"> Climate-Smart Future?</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of urban planners, citizens, and organizations creating sustainable, resilient cities for the next generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold orbital-hover flex items-center justify-center gap-2">
                  Start Exploring Cities
                  <Globe className="h-5 w-5" />
                </Button>
              </Link>

              <Link to="/community">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg flex items-center justify-center gap-2">
                  Join Community
                  <Users className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-primary-glow" />
            <span className="text-lg font-bold">Earth Resilience Dashboard</span>
          </div>
          <p className="text-muted-foreground mb-4">Powered by NASA Earth Data, Built for Climate Action</p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>NASA Earthdata</span>
            <span>•</span>
            <span>Copernicus GHSL</span>
            <span>•</span>
            <span>World Resources Institute</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
