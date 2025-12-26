import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Video, Users, Trash2, Plus } from "lucide-react";
import { eventService, Event } from "@/lib/events";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const EventsManager = ({ teacherId }: { teacherId: string }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "Webinar",
        date: "",
        time: "",
        location_url: "",
        details: "",
        agenda: "", // New field
        learning_outcomes: "", // New field
        itinerary: "" // New field (for long events)
    });

    const loadEvents = async () => {
        try {
            const data = await eventService.list();
            // Filter only events hosted by this teacher if needed, 
            // but for now the backend index returns all. 
            // We'll filter on frontend for the "Manage" view.
            setEvents(data.filter(e => String(e.teacher_id) === teacherId));
        } catch (error) {
            console.error("Failed to load events", error);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [teacherId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await eventService.create(formData);
            toast({ title: "Event hosted successfully!" });
            setIsCreating(false);
            setFormData({
                title: "",
                description: "",
                type: "Webinar",
                date: "",
                time: "",
                location_url: "",
                details: "",
                agenda: "",
                learning_outcomes: "",
                itinerary: ""
            });
            loadEvents();
        } catch (error) {
            toast({ title: "Failed to host event", variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await eventService.delete(id);
            toast({ title: "Event deleted" });
            loadEvents();
        } catch (error) {
            toast({ title: "Delete failed", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="text-primary" />
                    My Hosted Events
                </h2>
                <Button onClick={() => setIsCreating(!isCreating)} variant={isCreating ? "outline" : "default"}>
                    {isCreating ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Host New Event</>}
                </Button>
            </div>

            {isCreating && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Host a Webinar or Seminar</CardTitle>
                        <CardDescription>Enter details to invite students to your live session</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Event Title</label>
                                    <Input
                                        required
                                        placeholder="e.g. Masterclass: The Art of Irony"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Event Type</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Webinar</option>
                                        <option>Seminar</option>
                                        <option>Workshop</option>
                                        <option>Live Q&A</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Time</label>
                                    <Input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Meeting Link / Location</label>
                                    <Input
                                        placeholder="Zoom, Google Meet, or physical address"
                                        value={formData.location_url}
                                        onChange={e => setFormData({ ...formData, location_url: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Short Description (for Students)</label>
                                    <Textarea
                                        required
                                        placeholder="What will students learn?"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Initial Agenda</label>
                                    <Textarea
                                        placeholder="1. Introduction, 2. Live Demo..."
                                        value={formData.agenda}
                                        onChange={e => setFormData({ ...formData, agenda: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-sm font-medium">Learning Outcomes</label>
                                    <Textarea
                                        placeholder="Understand irony, Identify satire..."
                                        value={formData.learning_outcomes}
                                        onChange={e => setFormData({ ...formData, learning_outcomes: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Detailed Itinerary (Recommended for 4h+ sessions)</label>
                                    <Textarea
                                        placeholder="09:00 - Intro, 10:30 - Workshop Part 1, 13:00 - Lunch..."
                                        value={formData.itinerary}
                                        onChange={e => setFormData({ ...formData, itinerary: e.target.value })}
                                        rows={4}
                                    />
                                    <p className="text-[10px] text-muted-foreground italic">Break down the session by timestamps for lengthy events.</p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Additional Teacher Notes (Internal)</label>
                                    <Textarea
                                        placeholder="Preparation, reading material, etc."
                                        value={formData.details}
                                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Host Event</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {events.map(event => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{event.type}</Badge>
                                        <h3 className="text-lg font-bold">{event.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                        {/* @ts-ignore */}
                                        {event.agenda && (
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Agenda</span>
                                                <p className="text-[11px] text-slate-600 line-clamp-2 whitespace-pre-line">{event.agenda}</p>
                                            </div>
                                        )}
                                        {/* @ts-ignore */}
                                        {event.learning_outcomes && (
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Outcomes</span>
                                                <p className="text-[11px] text-slate-600 line-clamp-2 whitespace-pre-line">{event.learning_outcomes}</p>
                                            </div>
                                        )}
                                        {/* @ts-ignore */}
                                        {event.itinerary && (
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Itinerary (Long Session)</span>
                                                <p className="text-[11px] text-slate-600 line-clamp-2 whitespace-pre-line italic">{event.itinerary}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {event.time}
                                        </div>
                                        {event.location_url && (
                                            <div className="flex items-center gap-1">
                                                <Video className="w-3 h-3" />
                                                {event.location_url}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {events.length === 0 && !isCreating && (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                        No hosted events yet. Start by hosting your first webinar!
                    </div>
                )}
            </div>
        </div>
    );
};
