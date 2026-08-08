import Link from 'next/link';

export const metadata = { title: 'Accessibility — TrailsTV Lake Tahoe Planner' };

export default function AccessibilityPage() {
  return (
    <div className="sw" style={{ maxWidth: 760, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">Accessibility</div>
      <h1 className="stitle">Accessibility Statement</h1>
      <p style={{ color: 'var(--granite)', fontSize: '.8rem', marginBottom: '2.5rem' }}>
        Last reviewed: January 1, 2026
      </p>

      <div style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'rgba(242,245,247,.78)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          TrailsTV is committed to making the Lake Tahoe Planner accessible to everyone, including people with disabilities. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
        </p>

        {[
          {
            title: 'What We\'ve Done',
            body: `• Semantic HTML5 markup throughout the site
• Sufficient color contrast ratios for text and UI elements
• All images include descriptive alt text
• Interactive elements are keyboard-navigable
• Map interfaces include text-based alternatives (sidebar lists with full detail)
• Focus indicators visible on all interactive elements
• No content flashes or rapid animations that could trigger seizures`,
          },
          {
            title: 'Known Limitations',
            body: `• Interactive maps (Leaflet) have limited screen reader support — all map content is duplicated in the sidebar list with full details, so the map is not the only way to access any information.
• The live conditions ticker in the footer moves automatically — it can be paused by using the Refresh Data button instead, which loads the same data statically.
• Some third-party content (linked resort sites, Recreation.gov) may have their own accessibility limitations outside our control.`,
          },
          {
            title: 'Accessible Trails & Campgrounds',
            body: `Lake Tahoe has several accessible outdoor destinations worth highlighting:

• East Shore Trail — paved, flat, 4.2 miles between Spooner Lake and Sand Harbor
• Tahoe Meadows boardwalk — flat boardwalk loop at 8,740ft, fully accessible
• Kings Beach SRA — accessible beach, parking, and restrooms
• Pope Beach — accessible beach area with parking
• Camp Richardson — accessible RV sites and lake access
• Spooner Lake — accessible 2-mile interpretive loop
• Nevada Beach — accessible beach and campground sites

Contact Recreation.gov or individual parks to confirm current accessibility conditions.`,
          },
          {
            title: 'Technical Standards',
            body: `We aim to conform to WCAG 2.1 Level AA. We test using:

• Chrome DevTools accessibility panel
• Keyboard-only navigation testing
• Color contrast checking tools

We have not yet completed a full independent audit. We welcome feedback on any barriers you encounter.`,
          },
          {
            title: 'Feedback & Contact',
            body: `If you encounter any accessibility barriers on this site, please contact us. We take accessibility feedback seriously and aim to respond within 5 business days.

When contacting us about an accessibility issue, please include:
• The page URL where you encountered the issue
• A description of the barrier
• Your browser and assistive technology (if applicable)`,
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '.6rem', color: 'var(--glacial)' }}>
              {title}
            </h2>
            <div style={{ whiteSpace: 'pre-line' }}>{body}</div>
          </div>
        ))}

        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/contact" className="bp">Report an Accessibility Issue →</Link>
        </div>
      </div>
    </div>
  );
}
