import { GenericPage } from "@/components/GenericPage";

export default function Alumni() {
    return (
        <GenericPage
            title="Alumni Network"
            subtitle="A global syndicate of leaders who don't take themselves too seriously.">
            <p>
                Graduating from Ramay is just the beginning. You join an exclusive network of over 2,000
                executives, founders, and creatives who speak the same language.
            </p>
            <p>
                Our alumni hold leadership positions at major tech firms, financial institutions, and
                creative agencies across London, New York, and Singapore.
            </p>
            <p>
                <strong>Benefits:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Quarterly "Roast & Toast" networking dinners.</li>
                <li>Access to private masterclasses.</li>
                <li>Direct mentorship from Board Members.</li>
            </ul>
        </GenericPage>
    );
}
