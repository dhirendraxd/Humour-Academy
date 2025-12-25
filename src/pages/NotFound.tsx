import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <FadeIn>
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-9xl font-bold text-blue-600">404</h1>
              <h2 className="text-4xl font-bold text-foreground">Lost in the Comedy Club?</h2>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Looks like this page wandered off the stage. Let's get you back to the main show.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="secondary"
                className="rounded-full px-8 h-12 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageLayout>
  );
};

export default NotFound;
