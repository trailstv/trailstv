'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });

  const subjects = [
    'General question',
    'Report incorrect data',
    'Suggest a campground or trail',
    'Report a bug',
    'Partnership inquiry',
    'Other',
  ];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate submission — wire to your preferred email service
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="sw" style={{ maxWidth: 640, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">Get in Touch</div>
      <h1 className="stitle">Contact Us</h1>
      <p className="ssub" style={{ marginBottom: '2rem' }}>
        Questions, corrections, trail suggestions, or bug reports — we read everything.
      </p>

      {sent ? (
        <div style={{ background: 'rgba(74,188,120,.08)', border: '1px solid rgba(74,188,120,.3)', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '.5rem' }}>Message sent!</div>
          <div style={{ color: 'var(--granite)', fontSize: '.84rem' }}>
            We&apos;ll get back to you at {form.email} within 1–2 business days.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '.76rem', fontWeight: 600, color: 'var(--granite)', display: 'block', marginBottom: '.35rem' }}>
                Your name
              </label>
              <input className="fc" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '.76rem', fontWeight: 600, color: 'var(--granite)', display: 'block', marginBottom: '.35rem' }}>
                Email address
              </label>
              <input className="fc" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '.76rem', fontWeight: 600, color: 'var(--granite)', display: 'block', marginBottom: '.35rem' }}>
              Subject
            </label>
            <select className="fc" name="subject" value={form.subject} onChange={handleChange} style={{ width: '100%' }}>
              <option value="">Select a topic…</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '.76rem', fontWeight: 600, color: 'var(--granite)', display: 'block', marginBottom: '.35rem' }}>
              Message
            </label>
            <textarea
              className="fc"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what you need…"
              rows={6}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <button
            className="bp"
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.email || !form.message}
            style={{ alignSelf: 'flex-start' }}
          >
            {loading ? 'Sending…' : 'Send Message →'}
          </button>
        </div>
      )}

      <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(13,27,42,.6)', border: '1px solid var(--cborder)', borderRadius: 12, fontSize: '.82rem', color: 'var(--granite)', lineHeight: 1.75 }}>
        <div style={{ fontWeight: 600, color: 'var(--snow)', marginBottom: '.5rem' }}>Other ways to reach us</div>
        <div>📧 For data corrections: include the page URL and what needs updating.</div>
        <div>🏕️ To add a campground or trail: include name, coordinates, and booking URL.</div>
        <div>🐛 For bugs: include your browser, device, and what you expected to happen.</div>
      </div>
    </div>
  );
}
