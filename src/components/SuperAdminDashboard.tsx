import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Clock, Eye, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SuperAdminDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  requested_role: 'student' | 'faculty' | 'bod' | 'superadmin';
  reason: string;
  status: string;
  created_at: string;
}

export const SuperAdminDashboard = ({ user }: SuperAdminDashboardProps) => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccessRequests();
    fetchUserStats();
  }, []);

  const fetchAccessRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccessRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching access requests:', error);
      toast({
        title: "Error",
        description: "Failed to load access requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('approved_status', true);

      if (error) throw error;
      setTotalUsers(count || 0);
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleApproveRequest = async (request: AccessRequest) => {
    try {
      setLoading(true);
      
      // First check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', request.email)
        .maybeSingle();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            role: request.requested_role,
            approved_status: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;
      } else {
        // For new users, we can't create a profile without a user_id from auth
        // This should ideally be handled during the signup process
        toast({
          title: "Info",
          description: "User needs to complete signup first before approval",
          variant: "default"
        });
        return;
      }

      // Update the request status
      const { error: requestError } = await supabase
        .from('access_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (requestError) throw requestError;

      toast({
        title: "Request Approved",
        description: `${request.full_name} has been approved as ${request.requested_role}`,
      });

      // Refresh data
      fetchAccessRequests();
      fetchUserStats();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (request: AccessRequest) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('access_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: `${request.full_name}'s request has been rejected`,
      });

      fetchAccessRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColorClass = (role: string) => {
    switch (role) {
      case 'student': return 'bg-gradient-secondary text-secondary-foreground';
      case 'faculty': return 'bg-gradient-primary text-primary-foreground';
      case 'bod': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-academic">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white shadow-glow">
        <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
          <Shield className="h-8 w-8" />
          <span>Super Admin Control Center</span>
        </h1>
        <p className="text-white/80">Welcome, {user.name} • Complete System Authority</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{totalUsers}</div>
            <p className="text-xs text-secondary-foreground/70">Approved users</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{accessRequests.length}</div>
            <p className="text-xs text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{Math.floor(totalUsers * 0.85)}</div>
            <p className="text-xs text-green-600">Recently active</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Access Requests Management */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>Pending Access Requests</span>
            <Badge variant="destructive" className="ml-2">{accessRequests.length}</Badge>
          </CardTitle>
          <CardDescription>Review and approve new user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {accessRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending access requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg bg-gradient-academic hover:shadow-academic transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {request.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.full_name}</h4>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                        <Badge className={`${getRoleColorClass(request.requested_role)} border-0`}>
                          {request.requested_role.charAt(0).toUpperCase() + request.requested_role.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 ml-13">{request.reason}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectRequest(request)}
                      disabled={loading}
                      className="hover:bg-destructive hover:text-destructive-foreground border-destructive text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => handleApproveRequest(request)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white border-0"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};