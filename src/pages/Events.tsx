import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { eventService, Event } from "@/lib/events";

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await eventService.list();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <PageLayout>
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Upcoming <span className="text-blue-600">Events</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        Join us for workshops, performances, and lectures. Witness the intersection of
                        art and leadership in real-time.
                    </p>
                </div>
            </FadeIn>

            <section className="max-w-5xl mx-auto px-6 pb-32 space-y-6">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Looking for events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-background/40 backdrop-blur-md border border-dashed rounded-3xl">
                        <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold">No upcoming events</h3>
                        <p className="text-muted-foreground mt-2">Check back later for new webinars and seminars!</p>
                    </div>
                ) : (
                    events.map((event, i) => (
                        <FadeIn key={event.id} delay={i * 100} direction="up">
                            <Card className="bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg group overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-150 group-hover:bg-primary/10" />
                                <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                                    {/* Date Block */}
                                    <div className="flex-shrink-0 w-24 h-24 bg-secondary/10 rounded-2xl flex flex-col items-center justify-center text-center border border-secondary/20 group-hover:border-primary/30 transition-colors">
                                        <span className="text-sm font-bold text-secondary uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-3xl font-bold text-foreground">{new Date(event.date).getDate()}</span>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow space-y-4 text-center md:text-left">
                                        <div>
                                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-bold">{event.title}</h3>
                                                <Badge variant="outline" className="text-blue-600 border-blue-600/20 bg-blue-600/5">
                                                    {event.type}
                                                </Badge>
                                                {event.teacher && (
                                                    <span className="text-xs text-muted-foreground">by {event.teacher.name}</span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">{event.description}</p>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-muted-foreground font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {event.location_url?.startsWith('http') ? (
                                                    <Video className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                )}
                                                {event.location_url || 'TBA'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex-shrink-0">
                                        <Button className="rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-all">
                                            Join Now <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))
                )}
            </section>
        </PageLayout>
    );
}
