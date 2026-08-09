export const metadata = { title: 'Terms of Service — TrailsTV' };

const EFFECTIVE = 'January 1, 2026';

export default function TermsPage() {
  return (
    <div className="sw" style={{ maxWidth: 760, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">Legal</div>
      <h1 className="stitle">Terms of Service</h1>
      <p style={{ color: 'var(--granite)', fontSize: '.8rem', marginBottom: '2.5rem' }}>
        Effective date: {EFFECTIVE}
      </p>

      <div style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'rgba(242,245,247,.78)' }}>
        {[
          {
            title: '1. Acceptance',
            body: `By accessing or using TrailsTV ("the Service"), you agree to these Terms of Service. If you do not agree, do not use the Service.`,
          },
          {
            title: '2. What the Service Is',
            body: `TrailsTV is an outdoor adventure planning tool that aggregates publicly available data about campgrounds, trails, weather, fire restrictions, and other conditions in the Lake Tahoe basin. It is provided for informational and planning purposes only.`,
          },
          {
            title: '3. Accuracy of Information',
            body: `We aggregate data from federal and state agencies (Recreation.gov, USGS, USFS, NRCS) and other sources. While we make reasonable efforts to keep information current and accurate, we cannot guarantee the completeness or timeliness of any data.

Outdoor activities involve inherent risks. Always verify conditions directly with the relevant agency before departing on any trip, especially for fire restrictions, trail closures, wilderness permits, and backcountry routes. The Service is a planning aid — not a substitute for your own judgment, preparedness, and direct verification.`,
          },
          {
            title: '4. User Accounts',
            body: `You may create an account to save trip itineraries. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorized use.`,
          },
          {
            title: '5. Acceptable Use',
            body: `You agree not to:

• Use the Service for any unlawful purpose.
• Attempt to access, scrape, or copy data at scale without permission.
• Interfere with or disrupt the Service or its servers.
• Impersonate any person or entity.
• Upload or transmit malicious code.`,
          },
          {
            title: '6. Intellectual Property',
            body: `TrailsTV — including its design, code, and curated data — is owned by TrailsTV. Publicly-sourced federal data (Recreation.gov, USGS, USFS, NRCS) remains the property of the respective government agencies and is used under open data licenses.`,
          },
          {
            title: '7. Disclaimer of Warranties',
            body: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.`,
          },
          {
            title: '8. Limitation of Liability',
            body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRAILSTV SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO PERSONAL INJURY, PROPERTY DAMAGE, OR LOSS OF DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

Outdoor activities carry inherent risk. TrailsTV is not responsible for injuries, accidents, or losses that occur during activities planned using this Service.`,
          },
          {
            title: '9. Third-Party Links',
            body: `The Service contains links to external websites (Recreation.gov, USFS, resort sites, TahoeOutdoorsTV, etc.). We are not responsible for the content, accuracy, or practices of any third-party site.`,
          },
          {
            title: '10. Modifications',
            body: `We reserve the right to modify these Terms at any time. Material changes will be communicated via site notice or email. Continued use of the Service after changes constitutes acceptance of the revised Terms.`,
          },
          {
            title: '11. Governing Law',
            body: `These Terms are governed by the laws of the State of California, without regard to conflict-of-law provisions. Any disputes will be resolved in the courts of El Dorado County, California.`,
          },
          {
            title: '12. Contact',
            body: `Questions about these Terms: use the Contact page on this site.`,
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
