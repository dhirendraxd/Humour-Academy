import { GenericPage } from "@/components/GenericPage";

export default function Storytelling() {
    return (
        <GenericPage
            title="Storytelling"
            subtitle="Data tells, story sells. Learn the narrative structures that move mountains.">
            <p>
                Every great leader is a great storyteller. But most business storytelling is dry, predictable,
                and forgotten instantly. To be memorable, you must understand the architecture of surprise.
            </p>
            <p>
                Comedy writing is the most rigorous form of storytelling because the feedback loop is immediate:
                either they laugh, or they don't. We apply this rigor to corporate messaging.
            </p>
            <p>
                You will learn:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>The Setup/Punchline Structure:</strong> Creating expectation and subverting it.</li>
                <li><strong>The Callback:</strong> Weaving threads together for a satisfying conclusion.</li>
                <li><strong>The Act Out:</strong> Using character and dialogue to bring data to life.</li>
            </ul>
        </GenericPage>
    );
}
