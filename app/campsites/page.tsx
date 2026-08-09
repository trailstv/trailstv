'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CAMPS_FALLBACK, type Camp, avSt } from '@/lib/data';

const CampsiteMap = dynamic(() => import('@/components/CampsiteMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

type Shore   = 'all' | 'north' | 'south' | 'east' | 'west' | 'avail';
type SortKey = 'name' | 'avail';

export default function CampsitesPage() {
  const [camps,    setCamps]    = useState<Camp[]>(CAMPS_FALLBACK);
  const [filter,   setFilter]   = useState<Shore>('all');
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState<SortKey>('avail');
  const [selected, setSelected] = useState<Camp | null>(null);
  const [source,   setSource]   = useState<'fallback' | 'live'>('fallback');
  const [loading,  setLoading]  = useState(true);
  const [fetchedAt,setFetchedAt]= useState<string | null>(null);

  const fetchLive = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/campsites');
      const data = await res.json();
      if (data.camps && Array.isArray(data.camps)) {
        setCamps(data.camps);
        setSource(data.source === 'recreation.gov' ? 'live' : 'fallback');
        setFetchedAt(data.fetchedAt ?? null);
      }
    } catch (err) {
      console.warn('Campsite API unavailable, using static data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLive(); }, [fetchLive]);

  const filtered = camps
    .filter(c => {
      if (filter === 'avail') return avSt(c) !== 'full';
      if (filter !== 'all')   return c.shore === filter;
      return true;
    })
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name')  return a.name.localeCompare(b.name);
      const sa = avSt(a), sb = avSt(b);
      const rank = { open:0, limited:1, full:2 };
      return rank[sa] - rank[sb] || b.available - a.available;
    });

  const stLabel = (c: Camp) => {
    const st = avSt(c);
    if (st === 'open')    return <span className="dot-g">● {c.available} open</span>;
    if (st === 'limited') return <span className="dot-y">● {c.available} left</span>;
    return <span className="dot-r">● Full</span>;
  };

  return (
    <div className="sw">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'.5rem' }}>
        <div>
          <div className="eye">Recreation.gov · {source === 'live' ? 'Live Availability' : 'Static Data — Set RECGOV_KEY for live counts'}</div>
          <h2 className="stitle">Find Your Campsite</h2>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', paddingTop:'.5rem' }}>
          <span style={{ fontSize:'.72rem', color: source === 'live' ? '#4ABC78' : '#E0B85C' }}>
            {source === 'live' ? '🟢 Live data' : '🟡 Static data'}
            {fetchedAt && ` · ${new Date(fetchedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`}
          </span>
          <button
            className="mfb"
            onClick={fetchLive}
            disabled={loading}
            style={{ fontSize:'.72rem' }}
          >
            {loading ? '⟳ Loading…' : '↻ Refresh'}
          </button>
        </div>
      </div>
      <p className="ssub">
        10 verified campgrounds around Lake Tahoe. Click any card to book direct.
      </p>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
        <input
          className="fc"
          style={{ maxWidth:240 }}
          type="text"
          placeholder="Search campgrounds…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {(['all','north','south','west','east','avail'] as Shore[]).map(s => (
          <button
            key={s}
            className={`mfb${filter === s ? ' act' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'avail' ? 'Available Only' : s === 'all' ? 'All Shores' : `${s.charAt(0).toUpperCase()+s.slice(1)} Shore`}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="map-pane" style={{ marginBottom:'1.5rem' }}>
        <CampsiteMap camps={filtered} onSelect={setSelected} selected={selected} />
      </div>

      {/* Sort + count */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'.85rem 0' }}>
        <div style={{ fontSize:'.84rem', fontWeight:600 }}>
          {filtered.length} campground{filtered.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display:'flex', gap:'.4rem' }}>
          <button className={`mfb${sortKey==='avail'?' act':''}`} onClick={() => setSortKey('avail')}>Availability</button>
          <button className={`mfb${sortKey==='name'?' act':''}`}  onClick={() => setSortKey('name')}>Name</button>
        </div>
      </div>

      {/* Cards */}
      <div className="cresults">
        {filtered.length === 0 && (
          <div className="spin-wrap">No campgrounds match your filters.</div>
        )}
        {filtered.map(c => (
          <div
            key={c.id}
            className="camp-card"
            style={{ cursor:'pointer', borderColor: selected?.id === c.id ? 'var(--glacial)' : undefined }}
            onClick={() => setSelected(selected?.id === c.id ? null : c)}
          >
            <div className="camp-icon">{c.img}</div>
            <div className="camp-body">
              <div className="camp-name">{c.name}</div>
              <div className="camp-meta">
                {c.region} · ${c.fee}/night · {c.sites} sites{c.hookups ? ' · Hookups' : ''}{c.pets ? ' · Pets OK' : ''}
              </div>
              <div className="camp-chips">
                {c.amenities.slice(0,4).map(a => <span key={a} className="camp-chip">{a}</span>)}
              </div>
              <div style={{ fontSize:'.78rem', color:'var(--granite)', marginBottom:'.5rem' }}>{c.desc}</div>
              <div className="camp-actions">
                {stLabel(c)}
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bp"
                  style={{ padding:'5px 14px', fontSize:'.74rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  Book via {c.bookSystem} →
                </a>
                {c.phone && (
                  <a href={`tel:${c.phone}`} style={{ fontSize:'.74rem', color:'var(--granite)' }}>
                    {c.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
