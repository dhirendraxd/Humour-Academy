import { GenericPage } from "@/components/GenericPage";

export default function OpenMics() {
    return (
        <GenericPage
            title="Open Mics"
            subtitle="The laboratory of leadership. Where failure is mandatory and growth is inevitable.">
            <p>
                Every Thursday night, the Ramay Academy Lounge transforms into an open mic club.
                This is the gym where our students build their emotional muscles.
            </p>
            <p>
                It is open to the public, but reserved for the brave. Students test their material
                in front of a live, unvarnished audience.
            </p>
            <div className="bg-blue-600/10 p-6 rounded-xl border border-blue-600/20 my-8">
                <h3 className="text-xl font-bold text-blue-400 mb-2">Next Event:</h3>
                <p className="text-white">Thursday, Oct 24th @ 8:00 PM</p>
                <p className="text-sm opacity-70">The Underground, Shoreditch</p>
            </div>
        </GenericPage>
    );
}
