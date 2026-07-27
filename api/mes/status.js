/**
 * TIME-3X status API — production version discovery for triage automation.
 * GET /api/mes/status  (path kept for compatibility; payload is TIME-3X)
 *
 * Returns the currently deployed TIME-3X production version so Agents can
 * resolve affected_version without asking end users.
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function jstNowIso(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+09:00`;
}

module.exports = function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  const body = {
    service: 'time3x',
    environment: 'production',
    production_version: 'v3.0',
    release_name: 'TIME-3X Production',
    deployed_at: '2026-07-01T00:00:00+09:00',
    checked_at: jstNowIso(),
  };

  res.statusCode = 200;
  res.end(JSON.stringify(body));
};
