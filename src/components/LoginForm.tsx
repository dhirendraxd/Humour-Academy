import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onLogin: (role: 'student' | 'faculty' | 'bod' | 'superadmin') => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    requestedRole: 'student' as 'student' | 'faculty' | 'bod',
    reason: ''
  });
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // For demo purposes, allow login with any credentials
      console.log('Login attempt:', formData.email);
      // In real app, this would authenticate against Supabase
      onLogin('student'); // Default demo role
    } else {
      // For demo purposes, show request submitted message
      console.log('Access request submitted:', formData);
      setShowDemo(true);
    }
  };

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-academic flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-academic">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Request Submitted! 🎭</CardTitle>
            <CardDescription>
              Your access request has been sent to the Super Admin for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll be notified via email once your request is approved. 
                In the meantime, feel free to explore our demo dashboards!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Try the demo dashboards:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onLogin('student')}
                >
                  Student View
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onLogin('faculty')}
                >
                  Faculty View
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onLogin('bod')}
                >
                  BOD View
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onLogin('superadmin')}
                >
                  Super Admin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-academic flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-academic">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Ramay Institute</CardTitle>
          <CardDescription>
            {isLogin ? 'Welcome back to humor academia' : 'Request access to join our community'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role">Requested Role</Label>
                  <Select value={formData.requestedRole} onValueChange={(value: any) => setFormData({ ...formData, requestedRole: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student - Learn humor fundamentals</SelectItem>
                      <SelectItem value="faculty">Faculty - Teach and mentor students</SelectItem>
                      <SelectItem value="bod">Board of Directors - Institute leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Why do you want to join?</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Tell us about your humor journey and goals..."
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-gradient-primary border-0 hover:shadow-glow">
              {isLogin ? 'Sign In' : 'Request Access'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary"
              >
                {isLogin ? "Don't have access? Request it here" : 'Already have access? Sign in'}
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This is a demo. Click "Request Access" to see the approval workflow, 
                or use the demo buttons that will appear.
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};