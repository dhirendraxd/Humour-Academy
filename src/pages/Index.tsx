import { useNavigate } from "react-router-dom";
import { HomePage } from "@/components/HomePage";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return <HomePage
    onLoginClick={() => navigate('/auth')}
    isAuthenticated={!!user}
    onDashboardClick={() => navigate('/dashboard')}
  />;
};

export default Index;