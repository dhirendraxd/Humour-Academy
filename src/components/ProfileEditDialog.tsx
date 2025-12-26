import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
// import { supabase } from "@/integrations/supabase/client";
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
  // Use a safe setter that checks if setControlledOpen is defined before calling
  const setIsOpen = (value: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(value);
    } else {
      setInternalOpen(value);
    }
  };

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    rank: profile?.rank || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    try {
      // Mock update profile
      console.log("Updating profile mock", formData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      setIsOpen(false);
      // The profile will be automatically updated via the AuthProvider
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Rank/Title (Optional)</Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
              placeholder="Enter your rank or title"
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