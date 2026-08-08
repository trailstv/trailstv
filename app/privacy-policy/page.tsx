export const metadata = { title: 'Privacy Policy — TrailsTV Lake Tahoe Planner' };

const EFFECTIVE = 'January 1, 2026';

export default function PrivacyPage() {
  return (
    <div className="sw" style={{ maxWidth: 760, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">Legal</div>
      <h1 className="stitle">Privacy Policy</h1>
      <p style={{ color: 'var(--granite)', fontSize: '.8rem', marginBottom: '2.5rem' }}>
        Effective date: {EFFECTIVE}
      </p>

      <div style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'rgba(242,245,247,.78)' }}>
        {[
          {
            title: '1. What We Collect',
            body: `When you use the TrailsTV Lake Tahoe Planner, we may collect:

• Account information — name and email address when you create an account.
• Trip data — the trip preferences and itineraries you save voluntarily.
• Usage data — pages visited, features used, and time spent, collected through standard server logs and analytics.
• Device information — browser type, operating system, and IP address.

We do not collect precise location data, payment information, or any data from minors under 13.`,
          },
          {
            title: '2. How We Use Your Data',
            body: `We use collected data to:

• Provide and improve the Lake Tahoe Planner service.
• Save and display your trip itineraries.
• Send you account-related communications (never marketing without consent).
• Monitor for errors, abuse, and security threats.
• Analyse aggregate usage patterns to improve the product.

We never sell your personal data to third parties.`,
          },
          {
            title: '3. Third-Party Services',
            body: `The Planner integrates with the following third-party services. Each has its own privacy policy.

• Recreation.gov / RIDB API — campsite availability (US federal, no PII shared)
• OpenWeatherMap — weather data (no PII shared)
• USGS Water Services — lake level data (no PII shared)
• NRCS SNOTEL — snow data (no PII shared)
• USFS LTBMU — fire restriction data (no PII shared)
• Neon / Vercel — database hosting for account and trip data (data processed in the US)
• Google OAuth — optional sign-in (governed by Google's privacy policy)`,
          },
          {
            title: '4. Cookies',
            body: `We use essential cookies required for the site to function (session management, preference storage). We do not use tracking cookies or third-party advertising cookies. See our Cookie Policy for details.`,
          },
          {
            title: '5. Data Retention',
            body: `Account data is retained for as long as your account is active. Trip data is retained until you delete it or close your account. Server logs are retained for 30 days. You can request deletion of your account and all associated data by contacting us.`,
          },
          {
            title: '6. Your Rights',
            body: `Depending on your location, you may have the right to:

• Access the personal data we hold about you.
• Correct inaccurate data.
• Request deletion of your data.
• Object to certain processing.
• Export your data in a portable format.

To exercise any of these rights, contact us at the address below.`,
          },
          {
            title: '7. Security',
            body: `We use industry-standard security measures including HTTPS encryption, database-level access controls, and Vercel's infrastructure security. No system is 100% secure — if you discover a vulnerability, please contact us responsibly.`,
          },
          {
            title: '8. Children',
            body: `The TrailsTV Lake Tahoe Planner is not directed at children under 13. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.`,
          },
          {
            title: '9. Changes to This Policy',
            body: `We may update this policy as the service evolves. Material changes will be communicated via email (if you have an account) or a notice on the site. Continued use after changes constitutes acceptance.`,
          },
          {
            title: '10. Contact',
            body: `Questions about this policy: use the Contact page or email us directly via trailstv.com. We aim to respond within 5 business days.`,
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '.6rem', color: 'var(--glacial)' }}>
              {title}
            </h2>
            <div style={{ whiteSpace: 'pre-line' }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
