import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, GraduationCap, Users, Crown, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";

export default function Auth() {
  // ... existing state ... 

  // (Assuming state definitions are unchanged, focusing on imports and return)
  // But wait, I need to match the actual file content to replace it correctly. 
  // replacing imports is risky if I don't include all of them. 
  // Let's do imports first at the top.

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as 'student' | 'faculty' | 'bod',
    reason: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // const cleanupAuthState = () => {
  //   Object.keys(localStorage).forEach((key) => {
  //     if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
  //       localStorage.removeItem(key);
  //     }
  //   });
  // };

  const { signIn, signUp } = useAuth(); // Destructure methods from context instead of using supabase directly

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // cleanupAuthState();

      // Use mock signIn
      await signIn(loginData.email);

      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      navigate('/', { replace: true });

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use mock signUp
      await signUp(signupData.email, signupData.fullName, signupData.role);

      toast({
        title: "Registration Successful!",
        description: "Account created successfully. Logging you in...",
      });

      navigate('/', { replace: true });

      // Reset form (though we navigate away)
      setSignupData({
        email: "",
        password: "",
        fullName: "",
        role: "student",
        reason: ""
      });

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to sign up",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'faculty': return <Users className="h-4 w-4" />;
      case 'bod': return <Crown className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <PageLayout showNav={false}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <FadeIn>
          <div className="w-full max-w-md mx-auto relative z-10">
            {/* Modern Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                <span className="text-4xl text-blue-600">▲</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Ramay Academy
              </h1>
              <p className="text-muted-foreground">
                Where humor meets academic excellence
              </p>
            </div>

            {/* Auth Forms */}
            <Card className="shadow-lg border-border bg-card">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Access Your Account</CardTitle>
                <CardDescription>
                  Sign in to continue your journey with us
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full shadow-button hover:shadow-glass-hover transition-all duration-300" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>

                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="signupPassword">Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Create a password"
                          required
                          minLength={6}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">Requesting Role</Label>
                        <Select
                          value={signupData.role}
                          onValueChange={(value: 'student' | 'faculty' | 'bod') =>
                            setSignupData({ ...signupData, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">
                              <div className="flex items-center space-x-2">
                                {getRoleIcon('student')}
                                <span>Student</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="faculty">
                              <div className="flex items-center space-x-2">
                                {getRoleIcon('faculty')}
                                <span>Faculty</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="bod">
                              <div className="flex items-center space-x-2">
                                {getRoleIcon('bod')}
                                <span>Board of Directors</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full shadow-button hover:shadow-glass-hover transition-all duration-300" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>
    </PageLayout>
  );
}