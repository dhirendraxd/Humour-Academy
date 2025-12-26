import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { BODDashboard } from "@/components/BODDashboard";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { useEffect } from "react";

const Dashboard = () => {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!user || !profile)) {
            navigate('/auth');
        }
    }, [user, profile, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xl animate-pulse">
                        ▲
                    </div>
                </div>
                <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading Academy...</p>
            </div>
        );
    }

    if (!user || !profile) {
        return null; // Redirect handled in useEffect
    }

    const renderDashboard = () => {
        const userData = {
            name: profile.full_name,
            rank: profile.rank || 'Member',
            level: profile.level || 1,
            bio: profile.bio,
            city: profile.city,
            phone: profile.phone
        };

        switch (profile.role) {
            case 'student':
                return <StudentDashboard user={userData} />;
            case 'faculty':
                return <FacultyDashboard user={userData} userId={String(user.id)} />;
            default:
                return <StudentDashboard user={userData} />;
        }
    };

    return (
        <PageLayout
            showFooter={false}
            customNav={
                <Navigation
                    onRoleChange={(role) => {
                        // If we want to support role switching in Dashboard, we can still pass onRoleChange
                        // but Navigation will now handle the user/profile internally.
                    }}
                />
            }
        >
            <FadeIn>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderDashboard()}
                </div>
            </FadeIn>
        </PageLayout >
    );
};

export default Dashboard;
