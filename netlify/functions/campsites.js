// netlify/functions/campsites.js
//
// Serverless proxy for the Recreation.gov RIDB API.
// Your API key lives ONLY here as an environment variable —
// it never appears in any browser-visible file.
//
// SETUP:
//   Netlify Dashboard → Site Settings → Environment Variables
//   Add: RECGOV_KEY = your_actual_key_here
//
// ENDPOINT (after deploy):
//   GET /api/campsites?latitude=39.09&longitude=-120.03&radius=25&limit=50

exports.handler = async (event) => {
  const RECGOV_KEY = process.env.RECGOV_KEY;

  if (!RECGOV_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'RECGOV_KEY environment variable not set on server.' }),
    };
  }

  const {
    latitude  = '39.0968',
    longitude = '-120.0324',
    radius    = '25',
    limit     = '50',
    activity  = 'CAMPING',
  } = event.queryStringParameters || {};

  const params = new URLSearchParams({ latitude, longitude, radius, limit, activity, full: 'true' });
  const upstreamURL = `https://ridb.recreation.gov/api/v1/facilities?${params}`;

  try {
    const response = await fetch(upstreamURL, {
      headers: { apikey: RECGOV_KEY },
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({ error: `Recreation.gov error ${response.status}`, detail: text }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=900',  // cache 15 min at CDN edge
      },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Proxy fetch failed', detail: err.message }),
    };
  }
};

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    // Restrict to your own domain in production:
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
