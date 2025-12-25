import { GenericPage } from "@/components/GenericPage";

export default function TeamDynamics() {
    return (
        <GenericPage
            title="Team Dynamics"
            subtitle="Turn friction into fuel. Build psychological safety through shared laughter.">
            <p>
                High-performing teams don't just work together; they play together. Not in a frivolous way,
                but in a way that builds deep trust and rapid adaptability.
            </p>
            <p>
                We use principles from improv comedy—specifically "Yes, And"—to transform blocked teams into
                creative engines. When a team feels safe enough to laugh at mistakes, they feel safe enough
                to take the risks required for innovation.
            </p>
            <h3>Key Outcomes:</h3>
            <ul className="list-disc pl-6 space-y-2">
                <li>Reduced interpersonal conflict.</li>
                <li>Faster idea generation and iteration.</li>
                <li>A culture of honest, direct feedback delivered with levity.</li>
            </ul>
        </GenericPage>
    );
}
