import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Clock, Eye, UserPlus } from "lucide-react";

interface SuperAdminDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const SuperAdminDashboard = ({ user }: SuperAdminDashboardProps) => {
  const mockData = {
    totalUsers: 168,
    pendingRequests: 7,
    activeUsers: 142,
    accessRequests: [
      { 
        name: "John Martinez", 
        email: "john.martinez@email.com", 
        requestedRole: "student", 
        date: "2024-01-21",
        reason: "Aspiring comedian looking to improve my humor skills"
      },
      { 
        name: "Lisa Thompson", 
        email: "lisa.thompson@email.com", 
        requestedRole: "faculty", 
        date: "2024-01-20",
        reason: "PhD in Comedy Studies, 10 years teaching experience"
      },
      { 
        name: "Marcus Kim", 
        email: "marcus.kim@email.com", 
        requestedRole: "student", 
        date: "2024-01-20",
        reason: "Want to learn the art of witty conversation"
      },
      { 
        name: "Rachel Green", 
        email: "rachel.green@email.com", 
        requestedRole: "bod", 
        date: "2024-01-19",
        reason: "Former comedy club director with extensive industry connections"
      },
    ],
    recentActivity: [
      { action: "User Approved", user: "Alex Johnson", role: "student", time: "2 hours ago" },
      { action: "Faculty Promoted", user: "Dr. Smith", role: "faculty", time: "5 hours ago" },
      { action: "Access Denied", user: "Spam User", role: "student", time: "1 day ago" },
    ]
  };

  const handleApproveRequest = (email: string, role: string) => {
    console.log(`Approving ${email} for ${role} role`);
    // This would connect to Supabase when backend is set up
  };

  const handleRejectRequest = (email: string) => {
    console.log(`Rejecting request from ${email}`);
    // This would connect to Supabase when backend is set up
  };

  const getRoleColorClass = (role: string) => {
    switch (role) {
      case 'student': return 'bg-gradient-secondary text-secondary-foreground';
      case 'faculty': return 'bg-gradient-primary text-primary-foreground';
      case 'bod': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
            <div className="text-2xl font-bold text-secondary-foreground">{mockData.totalUsers}</div>
            <p className="text-xs text-secondary-foreground/70">All registered users</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{mockData.pendingRequests}</div>
            <p className="text-xs text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{mockData.activeUsers}</div>
            <p className="text-xs text-green-600">Currently online</p>
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
            <Badge variant="destructive" className="ml-2">{mockData.accessRequests.length}</Badge>
          </CardTitle>
          <CardDescription>Review and approve new user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.accessRequests.map((request, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-gradient-academic hover:shadow-academic transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                      </div>
                      <Badge className={`${getRoleColorClass(request.requestedRole)} border-0`}>
                        {request.requestedRole.charAt(0).toUpperCase() + request.requestedRole.slice(1)}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {request.date}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 ml-13">{request.reason}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="hover:bg-muted"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRejectRequest(request.email)}
                    className="hover:bg-destructive hover:text-destructive-foreground border-destructive text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleApproveRequest(request.email, request.requestedRole)}
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Management & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>System Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full h-12 bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
                User Management Console
              </Button>
              <Button className="w-full h-12 bg-gradient-primary border-0 hover:shadow-glow">
                Institute Analytics
              </Button>
              <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 border-0 hover:shadow-glow text-white">
                System Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-academic">
                  <div>
                    <h4 className="font-medium text-sm">{activity.action}</h4>
                    <p className="text-sm text-muted-foreground">{activity.user} • {activity.role}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};