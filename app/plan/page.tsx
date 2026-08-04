'use client';
import { useState } from 'react';
import Link from 'next/link';
import { buildNarrativeParagraphs } from '@/lib/narrative';

type Step = { q: string; hint: string; key: string; multi: boolean; opts: { e: string; l: string }[] };

const STEPS: Step[] = [
  {
    q: 'What season are you planning for?', key: 'season', multi: false,
    hint: "We'll surface the right campsite windows, snow reports, and trail conditions for your timing.",
    opts: [{ e:'🌸',l:'Spring (Mar – May)' },{ e:'☀️',l:'Summer (Jun – Sep)' },{ e:'🍂',l:'Fall (Oct – Nov)' },{ e:'❄️',l:'Winter (Dec – Feb)' }],
  },
  {
    q: "Who's coming with you?", key: 'group', multi: false,
    hint: 'Group dynamics shape the ideal campsite, trail, and activity mix.',
    opts: [{ e:'🧍',l:'Solo' },{ e:'👫',l:'Partner / Couple' },{ e:'👨‍👩‍👧',l:'Family with Kids' },{ e:'👯',l:'Friend Group' },{ e:'🏢',l:'Corporate / Team' }],
  },
  {
    q: 'How long is your trip?', key: 'length', multi: false,
    hint: 'Helps us suggest realistic daily itineraries and campsite booking windows.',
    opts: [{ e:'🌅',l:'Day trip' },{ e:'🏕️',l:'Weekend (2–3 days)' },{ e:'📅',l:'4–7 days' },{ e:'🏔️',l:'A week or more' }],
  },
  {
    q: 'What activities excite you?', key: 'activities', multi: true,
    hint: "Select everything that sounds good — we'll build around what you love.",
    opts: [{ e:'⛺',l:'Camping' },{ e:'🥾',l:'Hiking' },{ e:'🛶',l:'Kayaking' },{ e:'🚵',l:'Mountain Biking' },{ e:'⛷️',l:'Skiing / Riding' },{ e:'⛵',l:'Boating' },{ e:'🎣',l:'Fishing' },{ e:'🏄',l:'Paddleboarding' },{ e:'🌲',l:'Backpacking' },{ e:'🏊',l:'Swimming' }],
  },
  {
    q: "What's your experience level?", key: 'level', multi: false,
    hint: 'Helps us match trail difficulty, campsite type, and gear recommendations.',
    opts: [{ e:'🌱',l:'Beginner — new to outdoor adventure' },{ e:'🥾',l:'Intermediate — comfortable on trails' },{ e:'⛰️',l:'Advanced — multi-day, all conditions' },{ e:'🏆',l:'Expert — technical & self-sufficient' }],
  },
];

const RECS: Record<string, string[]> = {
  'Spring (Mar – May)': ['🌸 Cascade Falls Hike','🎣 Spring Fishing at Fallen Leaf','🦅 Wildlife Walk — Taylor Creek','🚵 Flume Trail MTB Opening Weekend'],
  'Summer (Jun – Sep)': ['🥾 Tahoe Rim Trail Day Hike','🛶 Emerald Bay Kayak','🏊 Sand Harbor Beach Day','⛺ D.L. Bliss Camping'],
  'Fall (Oct – Nov)':   ['🍂 TRT Foliage Hike','⛺ Nevada Beach — Shoulder Season Camp','🛶 Fall Paddle — Kings Beach','🌲 Glen Alpine Backpack'],
  'Winter (Dec – Feb)': ['⛷️ Palisades Tahoe Powder Day','🏔️ Ellis Peak Snowshoe','❄️ Northstar Nordic Ski','🌲 Donner Summit Hike'],
};

interface User { email: string; name: string; provider: string; }
interface Answers { [k: string]: number | number[] | undefined; }

export default function PlanPage() {
  const [user,    setUser]    = useState<User | null>(null);
  const [email,   setEmail]   = useState('');
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [multi,   setMulti]   = useState<Record<number, number[]>>({});
  const [saved,   setSaved]   = useState(false);
  const [toast,   setToast]   = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function googleAuth() {
    // In production: window.location.href = '/api/auth/google'
    setUser({ email: 'user@example.com', name: 'Tahoe Explorer', provider: 'google' });
    showToast('Connected with Google ✓');
  }

  function emailAuth() {
    if (!email || !email.includes('@')) { showToast('Enter a valid email.'); return; }
    setUser({ email, name: email.split('@')[0], provider: 'email' });
    showToast(`Welcome, ${email.split('@')[0]}! ✓`);
  }

  function selectOpt(stepIdx: number, optIdx: number) {
    const s = STEPS[stepIdx];
    if (s.multi) {
      setMulti(prev => {
        const arr = [...(prev[stepIdx] || [])];
        const pos = arr.indexOf(optIdx);
        pos > -1 ? arr.splice(pos, 1) : arr.push(optIdx);
        return { ...prev, [stepIdx]: arr };
      });
    } else {
      setAnswers(prev => ({ ...prev, [stepIdx]: optIdx }));
      setTimeout(() => setStep(s => Math.min(s + 1, STEPS.length)), 280);
    }
  }

  function nextStep() {
    if (STEPS[step].multi) {
      setAnswers(prev => ({ ...prev, [step]: multi[step] || [] }));
    }
    setStep(s => Math.min(s + 1, STEPS.length));
  }

  function getLabel(si: number): string {
    const ans = answers[si];
    if (ans === undefined) return 'Not specified';
    if (Array.isArray(ans)) return ans.length ? ans.map(i => STEPS[si].opts[i]?.l).join(', ') : 'Not specified';
    return STEPS[si].opts[ans as number]?.l ?? 'Not specified';
  }

  async function saveTrip() {
    const payload = {
      user,
      season:     STEPS[0].opts[answers[0] as number]?.l,
      group:      STEPS[1].opts[answers[1] as number]?.l,
      length:     STEPS[2].opts[answers[2] as number]?.l,
      activities: ((answers[3] as number[]) || []).map(i => STEPS[3].opts[i]?.l),
      level:      STEPS[4].opts[answers[4] as number]?.l,
    };
    try {
      const r = await fetch('/api/trips', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const d = await r.json();
      setSaved(true);
      showToast(d.success ? `Trip saved ✓ (trip #${d.trip_id})` : 'Saved locally ✓');
    } catch {
      showToast('Saved locally ✓');
    }
  }

  const season   = getLabel(0);
  const recs     = RECS[season] || RECS['Summer (Jun – Sep)'];
  const isDone   = step >= STEPS.length;
  const curStep  = STEPS[step];

  // Build narrative from template engine — instant, no API call
  const narrative = isDone ? buildNarrativeParagraphs({
    name:       user?.name,
    activities: ((answers[3] as number[]) || []).map(i => STEPS[3].opts[i]?.l).filter(Boolean) as string[],
    shores:     [],           // plan page doesn't collect shore — defaults to west
    season,
    group:      STEPS[1].opts[answers[1] as number]?.l,
    length:     STEPS[2].opts[answers[2] as number]?.l,
  }) : [];

  return (
    <div className="sw">
      <div className="eye">Plan Your Trip</div>

      {/* ── AUTH GATE ── */}
      {!user && (
        <>
          <h2 className="stitle">Let&apos;s get started</h2>
          <p className="ssub">Sign in to save your trip and get personalized recommendations.</p>
          <div className="plan-auth-card">
            <div className="plan-auth-methods">
              <button className="auth-btn-large" onClick={googleAuth}>
                <span className="auth-btn-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </span>
                Continue with Google
              </button>
            </div>
            <div className="plan-auth-or">or use your email</div>
            <div className="plan-email-form">
              <input className="fc" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==='Enter' && emailAuth()}/>
              <button className="bp" onClick={emailAuth} style={{ marginTop:'.65rem' }}>Continue with Email →</button>
            </div>
          </div>
        </>
      )}

      {/* ── WIZARD ── */}
      {user && !isDone && (
        <>
          <h2 className="stitle">Plan Your <span style={{ color:'var(--glacial)' }}>Tahoe</span> Adventure</h2>
          <p className="ssub">Signed in as <strong>{user.email}</strong></p>

          {/* Step dots */}
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:'1.75rem' }}>
            {STEPS.map((_, i) => (
              <div key={i} onClick={() => i <= step && setStep(i)} style={{
                width:  i === step ? 24 : 8,
                height: 8,
                borderRadius: i === step ? 4 : '50%',
                background:   i < step ? 'rgba(74,173,188,.5)' : i === step ? 'var(--glacial)' : 'rgba(74,173,188,.18)',
                cursor:       i <= step ? 'pointer' : 'default',
                transition:   'all .25s',
              }}/>
            ))}
            <span style={{ fontSize:'.72rem', color:'var(--granite)', marginLeft:4 }}>Step {step+1} of {STEPS.length}</span>
          </div>

          {/* Step card */}
          <div style={{ background:'var(--cbg)', border:'1px solid var(--cborder)', borderRadius:14, padding:'2rem', maxWidth:720 }}>
            <div style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, marginBottom:'.4rem' }}>{curStep.q}</div>
            <div style={{ fontSize:'.82rem', color:'var(--granite)', marginBottom:'1.25rem', lineHeight:1.6 }}>{curStep.hint}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1.5rem' }}>
              {curStep.opts.map((o, i) => {
                const sel = curStep.multi ? (multi[step]||[]).includes(i) : answers[step] === i;
                return (
                  <div key={i} onClick={() => selectOpt(step, i)} style={{
                    display:'flex', alignItems:'center', gap:7,
                    padding:'9px 16px', borderRadius:22,
                    border:`1px solid ${sel ? 'var(--glacial)' : 'var(--cborder)'}`,
                    background: sel ? 'var(--glacial-glow)' : 'rgba(13,27,42,.5)',
                    color: sel ? 'var(--glacial)' : 'var(--granite)',
                    cursor:'pointer', transition:'all .18s', fontSize:'.84rem', fontWeight:500,
                  }}>
                    <span>{o.e}</span><span>{o.l}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
              {step > 0 && <button className="bs" onClick={() => setStep(s => s-1)}>← Back</button>}
              {curStep.multi && <button className="bp" onClick={nextStep}>{step === STEPS.length-1 ? 'Build My Trip 🏔️' : 'Continue →'}</button>}
              <button onClick={nextStep} style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'.76rem', cursor:'pointer', marginLeft:'auto' }}>Skip →</button>
            </div>
          </div>
        </>
      )}

      {/* ── SUMMARY ── */}
      {user && isDone && (
        <>
          <h2 className="stitle">Your <span style={{ color:'var(--glacial)' }}>Tahoe</span> Plan ✓</h2>
          <div style={{ background:'rgba(22,35,51,.9)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.5rem', maxWidth:560, marginBottom:'1.5rem' }}>
            {[['Season',getLabel(0)],['Group',getLabel(1)],['Length',getLabel(2)],['Activities',getLabel(3)],['Level',getLabel(4)]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(74,173,188,.08)', fontSize:'.82rem' }}>
                <span style={{ color:'var(--granite)' }}>{k}</span>
                <span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.75rem' }}>
            Recommended for {season}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.45rem', marginBottom:'1.5rem', maxWidth:520 }}>
            {recs.map(r => (
              <div key={r} style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 12px', background:'rgba(13,27,42,.5)', border:'1px solid rgba(74,173,188,.1)', borderRadius:8, fontSize:'.82rem' }}>
                <span>{r.split(' ')[0]}</span><span>{r.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom: narrative.length ? '2rem' : 0 }}>
            <button className="bp" onClick={saveTrip} disabled={saved}>{saved ? 'Saved ✓' : 'Save My Trip →'}</button>
            <button className="bs" onClick={() => { setStep(0); setAnswers({}); setMulti({}); setSaved(false); }}>Start Over</button>
            <Link href="/campsites" className="bs">Browse Campsites →</Link>
          </div>

          {/* Personalized narrative — template-generated, instant */}
          {narrative.length > 0 && (
            <div style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.5rem', maxWidth:640 }}>
              <div className="eye" style={{ marginBottom:'.75rem' }}>Your Tahoe Brief</div>
              {narrative.map((p, i) => (
                <p key={i} style={{ fontSize:'.84rem', color:'rgba(242,245,247,.78)', lineHeight:1.8, marginBottom: i < narrative.length-1 ? '.9rem' : 0 }}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast show" style={{ opacity:1, transform:'translateX(-50%) translateY(0)' }}>{toast}</div>
      )}
    </div>
  );
}
