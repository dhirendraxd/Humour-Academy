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

  const { signIn, signUp } = useAuth(); // Destructure methods from context instead of using supabase directly

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

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
    <PageLayout showNav={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center p-4 py-16">
        <FadeIn>
          <div className="w-full max-w-lg mx-auto relative z-10">
            {/* Modern Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-3xl mb-6 ring-2 ring-blue-600/20 ring-offset-4 ring-offset-background">
                <span className="text-5xl text-blue-600">▲</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                Ramay <span className="text-blue-600">Academy</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Student Portal
              </p>
            </div>

            {/* Auth Forms */}
            <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl">
              <CardContent className="p-8">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/50">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-lg font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-lg font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login" className="mt-0">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                      <p className="text-sm text-muted-foreground">
                        Sign in to continue your journey
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="h-12 bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="Enter your password"
                            className="h-12 pr-12 bg-background/50"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup" className="mt-0">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Join Our Community</h2>
                      <p className="text-sm text-muted-foreground">
                        Create your account to get started
                      </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="fullName"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          placeholder="John Doe"
                          className="h-12 bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="text-sm font-medium">Email Address</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="h-12 bg-background/50"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="text-sm font-medium">Password</Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="Create a strong password"
                          className="h-12 bg-background/50"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium">I am a...</Label>
                        <Select
                          value={signupData.role}
                          onValueChange={(value: 'student' | 'faculty' | 'bod') =>
                            setSignupData({ ...signupData, role: value })
                          }
                        >
                          <SelectTrigger className="h-12 bg-background/50">
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
                                <span>Faculty Member</span>
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

                      <Button
                        type="submit"
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Back to Home Link */}
            <div className="text-center mt-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageLayout>
  );
}