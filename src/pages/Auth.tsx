import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getRoleHome = (role?: string) => {
    switch (role) {
      case 'faculty':
        return '/faculty';
      case 'bod':
        return '/dashboard';
      case 'student':
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    if (user) {
      const target = getRoleHome((user as { role?: string })?.role);
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    const target = getRoleHome((user as { role?: string })?.role);
    return <Navigate to={target} replace />;
  }

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google/redirect';
  };

  return (
    <PageLayout showNav={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center p-4 py-16">
        <FadeIn>
          <div className="w-full max-w-md mx-auto relative z-10">
            {/* Modern Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-3xl mb-6 ring-2 ring-blue-600/20 ring-offset-4 ring-offset-background">
                <span className="text-5xl text-blue-600">▲</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                Ramay <span className="text-blue-600">Academy</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Welcome to your learning journey
              </p>
            </div>

            {/* Google Sign-In Card */}
            <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
                  <p className="text-sm text-muted-foreground">
                    Continue with your Google account
                  </p>
                </div>

                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium rounded-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
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
