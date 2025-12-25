import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Events() {
    const events = [
        {
            title: "Executive Presence Workshop",
            date: "Oct 15, 2025",
            time: "10:00 AM - 4:00 PM",
            location: "Main Auditorium",
            category: "Workshop",
            description: "A one-day intensive on commanding the room using stand-up comedy techniques."
        },
        {
            title: "Fall Open Mic Night",
            date: "Oct 22, 2025",
            time: "7:00 PM - 10:00 PM",
            location: "The Lounge",
            category: "Performance",
            description: "Students showcase their material. Open to the public. Come see the future of leadership on stage."
        },
        {
            title: "Guest Lecture: Satire in Business",
            date: "Nov 05, 2025",
            time: "2:00 PM - 3:30 PM",
            location: "Lecture Hall B",
            category: "Lecture",
            description: "Industry leaders discuss how structured irony can de-escalate corporate conflict."
        },
        {
            title: "Improv for Agile Teams",
            date: "Nov 12, 2025",
            time: "1:00 PM - 5:00 PM",
            location: "Studio 4",
            category: "Workshop",
            description: "Adaptability training for product teams using fast-paced improv games."
        }
    ];

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
                {events.map((event, i) => (
                    <FadeIn key={i} delay={i * 100} direction="up">
                        <Card className="bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg group">
                            <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Date Block */}
                                <div className="flex-shrink-0 w-24 h-24 bg-secondary rounded-2xl flex flex-col items-center justify-center text-center border border-border group-hover:border-blue-600/30 transition-colors">
                                    <span className="text-sm font-bold text-muted-foreground uppercase">{event.date.split(' ')[0]}</span>
                                    <span className="text-3xl font-bold text-foreground">{event.date.split(' ')[1].replace(',', '')}</span>
                                </div>

                                {/* Details */}
                                <div className="flex-grow space-y-4 text-center md:text-left">
                                    <div>
                                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold">{event.title}</h3>
                                            <Badge variant="outline" className="text-blue-600 border-blue-600/20 bg-blue-600/5">
                                                {event.category}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">{event.description}</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex-shrink-0">
                                    <Button className="rounded-full bg-foreground text-background hover:bg-black/80">
                                        Register <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>
                ))}
            </section>
        </PageLayout>
    );
}
