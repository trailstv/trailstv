import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body.prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 });

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1000, messages:[{ role:'user', content: body.prompt }] }),
    });
    const data = await upstream.json();
    return NextResponse.json({ text: data.content?.[0]?.text ?? '' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
