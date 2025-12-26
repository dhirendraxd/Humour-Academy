import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Students from "./pages/Students";

import About from "./pages/About";
import Curriculum from "./pages/Curriculum";
import Events from "./pages/Events";
import ExecutivePresence from "./pages/ExecutivePresence";
import TeamDynamics from "./pages/TeamDynamics";
import Storytelling from "./pages/Storytelling";
import Alumni from "./pages/Alumni";
import OpenMics from "./pages/OpenMics";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/students" element={<Students />} />
              <Route path="/about" element={<About />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/events" element={<Events />} />

              {/* New Pages */}
              <Route path="/executive-presence" element={<ExecutivePresence />} />
              <Route path="/team-dynamics" element={<TeamDynamics />} />
              <Route path="/storytelling" element={<Storytelling />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/open-mics" element={<OpenMics />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
