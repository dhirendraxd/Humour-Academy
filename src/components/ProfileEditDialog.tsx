import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Settings, Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  triggerAsMenuItem?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ProfileEditDialog = ({
  triggerAsMenuItem = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: ProfileEditDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    city: "",
    phone: "",
    interests: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name,
        bio: profile.bio || "",
        city: profile.city || "",
        phone: profile.phone || "",
        interests: profile.interests ? profile.interests.join(", ") : ""
      });
    }
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    try {
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(i => i.length > 0);

      const updateData = {
        name: formData.name || undefined,
        bio: formData.bio || undefined,
        city: formData.city || undefined,
        phone: formData.phone || undefined,
        interests: interestsArray
      };

      await auth.updateProfile(updateData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated. Please refresh to see changes.",
      });

      setIsOpen(false);
      window.location.reload(); // Simple way to refresh context for now
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerElement = triggerAsMenuItem ? (
    <div className="flex items-center w-full">
      <Settings className="h-4 w-4 mr-2" />
      Edit Profile
    </div>
  ) : (
    <Button variant="outline" size="sm">
      <Settings className="h-4 w-4 mr-2" />
      Edit Profile
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and public profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="New Delhi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma separated)</Label>
            <Input
              id="interests"
              value={formData.interests}
              onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
              placeholder="Comedy, Writing, Acting..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us a bit about yourself..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};