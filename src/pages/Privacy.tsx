import { GenericPage } from "@/components/GenericPage";

export default function Privacy() {
    return (
        <GenericPage
            title="Privacy Policy"
            subtitle="We take your data seriously (even if we don't take ourselves seriously).">
            <p><strong>Last Updated: October 2025</strong></p>
            <p>
                Ramay Institute of Humour ("we", "us", "our") respects your privacy. This policy explains
                how we collect, use, and protect your personal information.
            </p>
            <h3>1. Data Collection</h3>
            <p>
                We collect information you provide directly to us, such as when you apply for a course,
                subscribe to our newsletter, or attend an event. This may include your name, email, and
                professional background.
            </p>
            <h3>2. Usage</h3>
            <p>
                We use this data to process your application, communicate with you about your cohort, and
                send you updates about academy evenets. We do NOT sell your data to third parties.
            </p>
            <h3>3. Cookies</h3>
            <p>
                We use cookies to improve your browsing experience and analyze site traffic. You can manage
                your cookie preferences in your browser settings.
            </p>
        </GenericPage>
    );
}
