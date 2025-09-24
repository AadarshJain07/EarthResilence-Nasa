import React, { useState, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Zap, Trees, Home, Hospital, Car, Plus, Minus, RotateCcw, Share, Save, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';

// 3D Globe Component
const Globe = ({ interventions }: { interventions: any }) => {
  return (
    <Canvas className="w-full h-96 rounded-lg shadow-lg bg-gradient-to-b from-blue-900 to-blue-700">
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial
            color={interventions.parks > 5 ? '#22c55e' : '#10b981'}
            attach="material"
            distort={0.2}
            speed={1.5}
          />
        </Sphere>
      </Suspense>
      <Stars radius={10} depth={20} count={2000} factor={4} saturation={0} fade />
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

const Simulate = () => {
  const [interventions, setInterventions] = useState({
    parks: 5,
    housing: 3,
    solar: 2,
    healthcare: 1,
    transport: 2,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const calculateMetrics = () => {
    const base = { aqi: 180, temperature: 35, greenCover: 25, livability: 60 };
    return {
      aqi: Math.max(50, base.aqi - (interventions.parks * 8) - (interventions.solar * 5)),
      temperature: Math.max(28, base.temperature - (interventions.parks * 0.8) - (interventions.solar * 0.3)),
      greenCover: Math.min(80, base.greenCover + (interventions.parks * 6)),
      livability: Math.min(95, base.livability + (interventions.parks * 4) + (interventions.healthcare * 8) + (interventions.housing * 3)),
    };
  };

  const metrics = calculateMetrics();

  const timeSeriesData = [
    { year: '2024', baseline: 180, simulated: metrics.aqi },
    { year: '2026', baseline: 185, simulated: Math.max(40, metrics.aqi - 20) },
    { year: '2028', baseline: 190, simulated: Math.max(35, metrics.aqi - 35) },
    { year: '2030', baseline: 195, simulated: Math.max(30, metrics.aqi - 50) },
  ];

  const interventionTypes = [
    { key: 'parks', name: 'Green Parks', icon: Trees, color: 'text-secondary-glow', impact: 'Reduces AQI & temperature', cost: 50 },
    { key: 'housing', name: 'Smart Housing', icon: Home, color: 'text-info', impact: 'Improves livability', cost: 100 },
    { key: 'solar', name: 'Solar Farms', icon: Zap, color: 'text-accent', impact: 'Clean energy & cooling', cost: 150 },
    { key: 'healthcare', name: 'Health Centers', icon: Hospital, color: 'text-success', impact: 'Boosts resilience score', cost: 120 },
    { key: 'transport', name: 'Green Transport', icon: Car, color: 'text-primary-glow', impact: 'Reduces emissions', cost: 80 },
  ];

  const updateIntervention = (key: string, delta: number) => {
    setInterventions(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key as keyof typeof prev] + delta)
    }));
  };

  const resetSimulation = () => {
    setInterventions({ parks: 5, housing: 3, solar: 2, healthcare: 1, transport: 2 });
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  const totalCost = interventionTypes.reduce((sum, type) =>
    sum + (interventions[type.key as keyof typeof interventions] * type.cost), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent mb-2">
            Urban Simulation Studio
          </h1>
          <p className="text-muted-foreground">Design climate-smart interventions and see their impact in real-time</p>
        </div>

        {/* 3D Globe */}
        <Suspense fallback={<div>Loading 3D Globe...</div>}>
          <Globe interventions={interventions} />
        </Suspense>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="data-point text-center">
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Air Quality</h3>
              <p className={`text-xl font-bold ${metrics.aqi > 150 ? 'text-destructive' : metrics.aqi > 100 ? 'text-warning' : 'text-success'}`}>
                {Math.round(metrics.aqi)}
              </p>
              <p className="text-xs text-muted-foreground">AQI</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Temperature</h3>
              <p className="text-xl font-bold text-accent">{metrics.temperature.toFixed(1)}°C</p>
              <p className="text-xs text-muted-foreground">Avg Daily</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Green Cover</h3>
              <p className="text-xl font-bold text-secondary-glow">{Math.round(metrics.greenCover)}%</p>
              <p className="text-xs text-muted-foreground">Vegetation</p>
            </CardContent>
          </Card>
          <Card className="data-point text-center">
            <CardContent className="p-4">
              <h3 className="text-sm text-muted-foreground mb-1">Livability</h3>
              <p className="text-xl font-bold text-info">{Math.round(metrics.livability)}%</p>
              <p className="text-xs text-muted-foreground">Index</p>
            </CardContent>
          </Card>
        </div>

        {/* Interventions Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="data-point">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Climate Interventions
              </CardTitle>
              <CardDescription>Adjust interventions to optimize city resilience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {interventionTypes.map(intervention => (
                <div key={intervention.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <intervention.icon className={`h-5 w-5 ${intervention.color}`} />
                      <div>
                        <h4 className="font-medium">{intervention.name}</h4>
                        <p className="text-xs text-muted-foreground">{intervention.impact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateIntervention(intervention.key, -1)}
                        disabled={interventions[intervention.key as keyof typeof interventions] === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Badge variant="secondary" className="min-w-[3rem] text-center">
                        {interventions[intervention.key as keyof typeof interventions]}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateIntervention(intervention.key, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="ml-8">
                    <Slider
                      value={[interventions[intervention.key as keyof typeof interventions]]}
                      onValueChange={([value]) => setInterventions(prev => ({ ...prev, [intervention.key]: value }))}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Cost</span>
                  <Badge variant="outline" className="text-accent">
                    ${totalCost.toLocaleString()}M
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={runSimulation} disabled={isSimulating} className="flex-1" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    {isSimulating ? 'Running...' : 'Run Simulation'}
                  </Button>
                  <Button onClick={resetSimulation} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Visualization */}
          <Card className="data-point">
            <CardHeader>
              <CardTitle>Impact Projection</CardTitle>
              <CardDescription>Projected AQI improvements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted) / 0.3)" strokeWidth={2} name="Business as Usual" />
                  <Area type="monotone" dataKey="simulated" stroke="hsl(var(--secondary-glow))" fill="hsl(var(--secondary) / 0.3)" strokeWidth={2} name="With Interventions" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Air Quality Improvement</span>
                  <Badge variant="secondary" className="text-success">
                    -{Math.round(180 - metrics.aqi)} AQI points
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temperature Reduction</span>
                  <Badge variant="secondary" className="text-info">
                    -{(35 - metrics.temperature).toFixed(1)}°C
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Green Cover Increase</span>
                  <Badge variant="secondary" className="text-secondary-glow">
                    +{Math.round(metrics.greenCover - 25)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Livability Score</span>
                  <Badge variant="secondary" className="text-primary-glow">
                    +{Math.round(metrics.livability - 60)} points
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save & Share */}
        <Card className="data-point">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button variant="secondary" className="flex-1 md:flex-none">
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
              <Button variant="outline" className="flex-1 md:flex-none">
                <Share className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Simulate;
