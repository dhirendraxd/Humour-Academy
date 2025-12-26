import { courseService, Course } from "@/lib/courses";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const StudentCourses = ({ onBack }: { onBack: () => void }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseService.list();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (courseId: number) => {
        try {
            await courseService.apply(courseId);
            toast({
                title: "Application Sent",
                description: "Your request has been sent to the teacher.",
            });
        } catch (error: any) {
            toast({
                title: "Application Failed",
                description: error.message || "Could not apply for course.",
                variant: "destructive"
            });
        }
    };

    return (
        <FadeIn>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center space-x-3 tracking-tight">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <span>Available Courses</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Browse and apply for new courses</p>
                    </div>
                    <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map(course => (
                        <Card key={course.id} className="hover:shadow-lg transition-all">
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>
                                    Taught by {course.teacher?.name} ({course.teacher?.rank})
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                    {course.description}
                                </p>
                                <Button className="w-full" onClick={() => handleApply(course.id)}>
                                    Apply for Course
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {courses.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No courses available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};
