import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Plus, Loader2, MapPin, TreePine } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const ecoActionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  action_type: z.string().min(1, "Action type is required"),
  location: z.string().trim().max(100, "Location must be less than 100 characters").optional(),
});

interface CreateEcoActionProps {
  onActionCreated?: () => void;
}

const CreateEcoAction: React.FC<CreateEcoActionProps> = ({ onActionCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    action_type: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const actionTypes = [
    { value: 'tree_planting', label: 'Tree Planting', icon: '🌳' },
    { value: 'solar_installation', label: 'Solar Installation', icon: '☀️' },
    { value: 'composting', label: 'Composting', icon: '🌱' },
    { value: 'recycling', label: 'Recycling', icon: '♻️' },
    { value: 'bike_commuting', label: 'Bike Commuting', icon: '🚴' },
    { value: 'water_conservation', label: 'Water Conservation', icon: '💧' },
    { value: 'energy_saving', label: 'Energy Saving', icon: '⚡' },
    { value: 'plastic_reduction', label: 'Plastic Reduction', icon: '🚫' },
    { value: 'community_cleanup', label: 'Community Cleanup', icon: '🧹' },
    { value: 'education_outreach', label: 'Education & Outreach', icon: '📚' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form data
    try {
      ecoActionSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }

      // Calculate XP and EcoCoin rewards based on action type
      const getRewards = (actionType: string) => {
        const rewardMap: Record<string, { xp: number; coins: number }> = {
          tree_planting: { xp: 75, coins: 15 },
          solar_installation: { xp: 100, coins: 25 },
          composting: { xp: 30, coins: 8 },
          recycling: { xp: 20, coins: 5 },
          bike_commuting: { xp: 25, coins: 6 },
          water_conservation: { xp: 40, coins: 10 },
          energy_saving: { xp: 35, coins: 8 },
          plastic_reduction: { xp: 30, coins: 7 },
          community_cleanup: { xp: 50, coins: 12 },
          education_outreach: { xp: 60, coins: 15 },
        };
        return rewardMap[actionType] || { xp: 25, coins: 5 };
      };

      const rewards = getRewards(formData.action_type);

      // Create eco action
      const { error } = await supabase
        .from('eco_actions')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          action_type: formData.action_type,
          location: formData.location.trim() || null,
          image_url: imageUrl,
          xp_reward: rewards.xp,
          eco_coins_reward: rewards.coins,
          verification_status: 'pending',
        });

      if (error) throw error;

      toast({
        title: "Eco Action Submitted! 🌱",
        description: "Your action is being reviewed and will appear in the community feed once verified.",
        className: "border-secondary-glow bg-secondary-glow/10",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        action_type: '',
        location: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setIsOpen(false);
      
      onActionCreated?.();

    } catch (error) {
      console.error('Error creating eco action:', error);
      toast({
        title: "Error",
        description: "Failed to submit your eco action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="data-point cursor-pointer orbital-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 text-center">
              <Camera className="h-6 w-6 text-secondary-glow" />
              <div>
                <h3 className="font-semibold">Share Your Eco Action</h3>
                <p className="text-sm text-muted-foreground">Post your climate action and earn rewards</p>
              </div>
              <Plus className="h-5 w-5 text-secondary-glow" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-secondary-glow" />
            Share Your Eco Action
          </DialogTitle>
          <DialogDescription>
            Document your climate action and inspire others in the community
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Action Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Planted 5 trees in Central Park"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="action_type">Action Type *</Label>
            <Select 
              value={formData.action_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, action_type: value }))}
            >
              <SelectTrigger className={errors.action_type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.action_type && <p className="text-sm text-destructive mt-1">{errors.action_type}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us about your climate action..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., New York, NY"
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
          </div>

          <div>
            <Label htmlFor="image">Photo Evidence (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              <Camera className="h-5 w-5 text-muted-foreground" />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-xs text-muted-foreground">
              * Actions are reviewed before appearing in feed
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="orbital-hover"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Action'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEcoAction;