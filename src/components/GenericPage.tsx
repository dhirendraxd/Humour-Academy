import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";

interface GenericPageProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const GenericPage = ({ title, subtitle, children }: GenericPageProps) => {
    return (
        <PageLayout>
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        {title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        {subtitle}
                    </p>
                </div>
            </FadeIn>

            <section className="max-w-4xl mx-auto px-6 pb-32">
                <div className="bg-background/60 backdrop-blur-md border border-border/50 p-8 md:p-12 rounded-3xl shadow-lg space-y-6 text-lg text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </section>
        </PageLayout>
    );
};
