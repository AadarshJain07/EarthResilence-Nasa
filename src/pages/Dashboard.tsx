import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Trees, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchCity, setSearchCity] = useState('');

  // Mock NASA/Climate data
  const climateData = [
    { month: 'Jan', temperature: 25, aqi: 156, humidity: 65 },
    { month: 'Feb', temperature: 28, aqi: 134, humidity: 58 },
    { month: 'Mar', temperature: 32, aqi: 178, humidity: 62 },
    { month: 'Apr', temperature: 35, aqi: 198, humidity: 68 },
    { month: 'May', temperature: 38, aqi: 225, humidity: 72 },
    { month: 'Jun', temperature: 36, aqi: 187, humidity: 85 },
  ];

  const cityMetrics: Record<string, any> = {
    Mumbai: {
      aqi: 198,
      temperature: 34,
      humidity: 78,
      vegetation: 32,
      waterQuality: 65,
      urbanGrowth: 85,
      alerts: [
        { type: 'danger', message: 'High AQI levels detected', icon: AlertTriangle },
        { type: 'warning', message: 'Heat island effect increasing', icon: Thermometer },
      ]
    },
    Delhi: {
      aqi: 210,
      temperature: 36,
      humidity: 60,
      vegetation: 28,
      waterQuality: 58,
      urbanGrowth: 92,
      alerts: [
        { type: 'danger', message: 'Severe pollution levels', icon: AlertTriangle },
      ]
    }
  };

  const handleCitySearch = () => {
    if (searchCity.trim() && cityMetrics[searchCity.trim()]) {
      setSelectedCity(searchCity.trim());
      setSearchCity('');
    } else if(searchCity.trim()) {
      alert('City data not available.');
      setSearchCity('');
    }
  };

  const metrics = cityMetrics[selectedCity];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-glow to-secondary-glow bg-clip-text text-transparent">
              City Climate Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time NASA Earth data insights for climate-smart urban planning
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="w-64"
              onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
            />
            <Button onClick={handleCitySearch} variant="secondary">
              <MapPin className="h-4 w-4 mr-2" />
              Explore
            </Button>
          </div>
        </div>

        {/* Current City Overview */}
        <Card className="data-point">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-glow" />
                  {selectedCity}
                </CardTitle>
                <CardDescription>NASA Earth observation data</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse-glow">
                <Eye className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Air Quality Index', value: metrics.aqi, icon: Wind, trend: <TrendingUp className="h-3 w-3 mr-1 text-destructive" />, color: 'destructive', max: 500 },
            { label: 'Temperature', value: metrics.temperature, icon: Thermometer, trend: <TrendingUp className="h-3 w-3 mr-1 text-accent" />, color: 'accent', max: 50 },
            { label: 'Vegetation Cover', value: metrics.vegetation, icon: Trees, trend: <TrendingDown className="h-3 w-3 mr-1 text-destructive" />, color: 'secondary', max: 100 },
            { label: 'Water Quality', value: metrics.waterQuality, icon: Droplets, trend: <TrendingUp className="h-3 w-3 mr-1 text-secondary" />, color: 'info', max: 100 },
          ].map((metric, idx) => (
            <Card key={idx} className="data-point orbital-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className={`text-2xl font-bold text-${metric.color}`}>{metric.value}{metric.label === 'Temperature' ? '°C' : ''}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      {metric.trend}
                      {metric.label === 'Air Quality Index' ? '+12% from last month' : metric.label === 'Vegetation Cover' ? '-5% from last year' : metric.label === 'Temperature' ? 'Heat island effect' : 'Stable'}
                    </p>
                  </div>
                  <metric.icon className={`h-8 w-8 text-${metric.color} opacity-80`} />
                </div>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(metric.value/metric.max)*100}%` }}>
                  <Progress value={(metric.value/metric.max)*100} className="mt-3" />
                </motion.div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="data-point">
            <CardHeader>
              <CardTitle>Climate Trends (6 Months)</CardTitle>
              <CardDescription>Temperature and AQI patterns from NASA MODIS data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="temperature" stroke="hsl(var(--accent))" fill="hsl(var(--accent)/0.3)" strokeWidth={2} />
                  <Area type="monotone" dataKey="aqi" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive)/0.3)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="data-point">
            <CardHeader>
              <CardTitle>Urban Growth Analysis</CardTitle>
              <CardDescription>Settlement expansion from GHSL data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="humidity" fill="hsl(var(--primary-glow))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="data-point">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Climate Alerts & Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights from satellite data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.alerts.map((alert, index) => (
                <div key={index} className={`flex items-center gap-3 p-4 rounded-lg border
                  ${alert.type === 'danger' ? 'border-destructive/20 bg-destructive/5' : 'border-warning/20 bg-warning/5'}`}>
                  <alert.icon className={`h-5 w-5 ${alert.type === 'danger' ? 'text-destructive' : 'text-warning'}`} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
