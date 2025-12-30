import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Edit3,
  Search,
  Crown,
  Star,
  GraduationCap,
  Plus,
  Loader2,
  TrendingUp
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'bod';
  rank: string | null;
  level: number;
  created_at: string;
}

interface UserManagementProps {
  currentUserRole: 'student' | 'faculty' | 'bod';
  allowedRoles: ('student' | 'faculty' | 'bod')[];
  title: string;
  description?: string;
  canEdit?: boolean;
}

export const UserManagement = ({
  currentUserRole,
  allowedRoles,
  title,
  description = "Manage users and their roles",
  canEdit = false
}: UserManagementProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [performancePlan, setPerformancePlan] = useState("");
  const [planGoals, setPlanGoals] = useState("");
  const [planMentor, setPlanMentor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setUsers([]);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [allowedRoles]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'faculty': return <Star className="h-4 w-4" />;
      case 'bod': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      student: 'bg-gradient-secondary text-secondary-foreground',
      faculty: 'bg-gradient-primary text-primary-foreground',
      bod: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    };

    return (
      <Badge className={`${variants[role as keyof typeof variants]} border-0`}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    );
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      // Save performance plan to backend
      await api.put(`/users/${editingUser.id}/performance-plan`, {
        plan: performancePlan,
        goals: planGoals,
        mentor: planMentor,
      });
      
      toast({
        title: "Success",
        description: "Performance plan saved successfully.",
      });
      
      setIsPlanDialogOpen(false);
      setPerformancePlan("");
      setPlanGoals("");
      setPlanMentor("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save plan.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <Card className="shadow-academic">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>{title}</span>
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {allowedRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center space-x-2 capitalize">
                      {getRoleIcon(role)}
                      <span>{role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-gradient-glass/30 hover:bg-gradient-glass/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 shadow-glass border-2 border-border/20">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.rank && `${user.rank} • `}Level {user.level}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getRoleBadge(user.role)}
                    <div className="flex items-center space-x-2">
                      {user.role === 'student' && currentUserRole === 'faculty' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user);
                            setPerformancePlan(""); // Reset or fetch existing
                            setIsPlanDialogOpen(true);
                          }}
                          className="text-[10px] h-8 font-bold uppercase tracking-tight border-slate-200 hover:bg-slate-50 text-slate-600"
                        >
                          Plan
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditDialogOpen(true);
                        }}
                        className="hover:bg-accent/50"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {canEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_full_name">Full Name</Label>
                  <Input
                    id="edit_full_name"
                    value={editingUser.full_name}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      full_name: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_rank">Rank/Title</Label>
                  <Input
                    id="edit_rank"
                    value={editingUser.rank || ''}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      rank: e.target.value
                    })}
                    placeholder="Enter rank or title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_level">Level</Label>
                  <Input
                    id="edit_level"
                    type="number"
                    min="1"
                    value={editingUser.level}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      level: parseInt(e.target.value) || 1
                    })}
                    required
                  />
                </div>

                {currentUserRole === 'bod' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit_role">Role</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) => setEditingUser({
                        ...editingUser,
                        role: value as 'student' | 'faculty' | 'bod'
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Student</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="faculty">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>Faculty</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bod">
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4" />
                            <span>Board of Directors</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
      {/* Performance Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Student Performance Plan
            </DialogTitle>
            <DialogDescription>
              Create a personalized development plan for <span className="font-bold text-slate-800">{editingUser?.full_name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Long-term Career Goals</Label>
              <Textarea
                placeholder="What is the student's ultimate aim? (e.g., Stand-up Special, Writing for TV)"
                value={planGoals}
                onChange={(e) => setPlanGoals(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Mentor / Guidance</Label>
              <Input
                placeholder="Name of the senior faculty member overseeing this plan"
                value={planMentor}
                onChange={(e) => setPlanMentor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Personalized Guidance & Actionable Steps</Label>
              <Textarea
                placeholder="e.g. Focus on timing control in jokes, Practice deadpan delivery..."
                value={performancePlan}
                onChange={(e) => setPerformancePlan(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Tip: Be concrete with learning outcome pointers to help the student understand their specific path to improvement.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSavePlan}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
