export const metadata = { title: 'Cookie Policy — TrailsTV' };

export default function CookiesPage() {
  return (
    <div className="sw" style={{ maxWidth: 760, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">Legal</div>
      <h1 className="stitle">Cookie Policy</h1>
      <p style={{ color: 'var(--granite)', fontSize: '.8rem', marginBottom: '2.5rem' }}>
        Last updated: January 1, 2026
      </p>

      <div style={{ fontSize: '.88rem', lineHeight: 1.85, color: 'rgba(242,245,247,.78)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          This Cookie Policy explains what cookies are, which ones TrailsTV uses, and what your choices are. The short version: we use only essential cookies. No advertising cookies. No third-party tracking.
        </p>

        {[
          {
            title: 'What Are Cookies?',
            body: `Cookies are small text files stored in your browser when you visit a website. They allow the site to remember things about your visit — like whether you're logged in — across page loads.`,
          },
          {
            title: 'Cookies We Use',
            body: null,
            table: [
              { name: 'session', purpose: 'Keeps you logged in during your visit', duration: 'Session (deleted when browser closes)', type: 'Essential' },
              { name: 'preferences', purpose: 'Remembers your filter preferences (shore, difficulty)', duration: '30 days', type: 'Essential' },
              { name: '__vercel_*', purpose: 'Vercel infrastructure routing — required for the site to function', duration: 'Session', type: 'Essential' },
            ],
          },
          {
            title: 'Cookies We Do NOT Use',
            body: `• Advertising or retargeting cookies
• Analytics cookies (Google Analytics, Mixpanel, etc.)
• Social media tracking pixels (Facebook, X, TikTok, etc.)
• Third-party behavioral tracking of any kind

We do not serve ads, and we have no reason to track you across the web.`,
          },
          {
            title: 'Third-Party Cookies',
            body: `Some features link to external services — Recreation.gov, ski resort sites, TahoeOutdoorsTV. If you click those links, those sites may set their own cookies governed by their own policies. We have no control over those cookies.`,
          },
          {
            title: 'Your Choices',
            body: `You can control or delete cookies through your browser settings. Deleting essential cookies will log you out and clear your preferences. Most browsers let you:

• View which cookies are stored
• Delete individual cookies or all cookies
• Block cookies from specific sites
• Block all third-party cookies

Note: blocking essential cookies may break certain features of this site.`,
          },
          {
            title: 'Changes to This Policy',
            body: `If we add new cookies or change how we use existing ones, we will update this page and the "Last updated" date above.`,
          },
          {
            title: 'Contact',
            body: `Questions? Use the Contact page on this site.`,
          },
        ].map(({ title, body, table }) => (
          <div key={title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '.6rem', color: 'var(--glacial)' }}>
              {title}
            </h2>
            {body && <div style={{ whiteSpace: 'pre-line' }}>{body}</div>}
            {table && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.8rem', marginTop: '.5rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(13,27,42,.8)' }}>
                      {['Cookie name', 'Purpose', 'Duration', 'Type'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--granite)', fontWeight: 600, borderBottom: '1px solid var(--cborder)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--cborder)' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--glacial)' }}>{row.name}</td>
                        <td style={{ padding: '8px 12px' }}>{row.purpose}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--granite)' }}>{row.duration}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{ background: 'rgba(74,188,120,.1)', color: '#4ABC78', borderRadius: 4, padding: '1px 7px', fontSize: '.72rem', fontWeight: 700 }}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
