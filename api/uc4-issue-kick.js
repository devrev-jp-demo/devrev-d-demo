/**
 * UC4 Issue Kick — create DevRev Issue with CF+Tag dual-write and Ticket link.
 *
 * GET /api/uc4-issue-kick
 *   secret=<UC4_TRIAGE_SECRET>
 *   ticket_id=TKT-NN
 *   title=...
 *   body=... (URL-encoded markdown)
 *   part=FEAT-8
 *   affected_version=v3.0
 *   incident_date=YYYY-MM-DD
 *   tags=ver:v3.0,regression,escalated-to-dev  (comma-separated names)
 *
 * Env: DEVREV_PAT (required), UC4_TRIAGE_SECRET (optional)
 */

const BASE = 'https://api.devrev.ai';
const TICKET_FRAGMENT = 'don:core:dvrv-us-1:devo/1mIWZgIgFF:tenant_fragment/23';
const ISSUE_FRAGMENT = 'don:core:dvrv-us-1:devo/1mIWZgIgFF:tenant_fragment/24';
/** Github Airdrop subtype display_name: devrev-d-demo/Issues */
const GITHUB_ISSUE_SUBTYPE =
  'i5uvi2dxmjpyo2lunb2yelljnxwg64tul5qys4teojvvallhnf2gq5lcfxsvq5dsmfrvi33sfxyg6wlemxzf6zdfozzgk5rnnjwc2zdfnxvx6mjtgawteojsgawdmv3jonzvkzlt';
const OWNER = 'DEVU-1';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

function parseQuery(req) {
  const u = new URL(req.url, 'http://localhost');
  const q = Object.fromEntries(u.searchParams.entries());
  return q;
}

async function devrevPost(pat, path, body) {
  const r = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: r.status, data, text };
}

async function resolveTagIds(pat, names) {
  const wanted = names.map((n) => n.trim()).filter(Boolean);
  if (!wanted.length) return [];
  const { status, data } = await devrevPost(pat, 'tags.list', { limit: 100 });
  if (status >= 400) return [];
  const byName = {};
  for (const t of data.tags || []) {
    if (t.name) byName[t.name] = t.display_id || t.id;
  }
  return wanted.map((n) => byName[n]).filter(Boolean);
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-UC4-Secret');
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const pat = process.env.DEVREV_PAT;
  if (!pat) return json(res, 500, { error: 'DEVREV_PAT missing' });

  const q = parseQuery(req);
  let bodyJson = {};
  if (req.method === 'POST' && req.body && typeof req.body === 'object') {
    bodyJson = req.body;
  }
  const secretExpected = process.env.UC4_TRIAGE_SECRET || '';
  const secretGot =
    q.secret || bodyJson.secret || req.headers['x-uc4-secret'] || '';
  if (secretExpected && secretGot !== secretExpected) {
    return json(res, 401, { error: 'unauthorized' });
  }

  const ticketId = q.ticket_id || q.ticket || bodyJson.ticket_id || bodyJson.ticket;
  const title = q.title || bodyJson.title;
  const body = q.body || bodyJson.body || '';
  const part = q.part || bodyJson.part || 'FEAT-8';
  const affectedVersion =
    q.affected_version || bodyJson.affected_version || 'v3.0';
  const incidentDate =
    q.incident_date || bodyJson.incident_date || '2026-07-14';
  const tagNames = String(
    q.tags || bodyJson.tags || 'ver:v3.0,regression,escalated-to-dev',
  ).split(',');

  if (!title) return json(res, 400, { error: 'title required' });

  const tagIds = await resolveTagIds(pat, tagNames);

  const createBody = {
    type: 'issue',
    title,
    body,
    applies_to_part: part,
    owned_by: [OWNER],
    stage: { name: 'triage' },
    tags: tagIds.map((id) => ({ id })),
    custom_schema_fragments: [ISSUE_FRAGMENT],
    custom_fields: {
      tnt__affected_version: affectedVersion,
      tnt__incident_date: incidentDate,
    },
  };

  const created = await devrevPost(pat, 'works.create', createBody);
  if (created.status >= 400) {
    return json(res, created.status, {
      error: 'works.create_failed',
      detail: created.data,
    });
  }
  const issue = created.data.work || {};
  const issueId = issue.display_id || issue.id;
  const issueDon = issue.id || issueId;

  // Subtype is required for AirSync DevRev → GitHub (cannot set reliably on create)
  const subtypeRes = await devrevPost(pat, 'works.update', {
    id: issueDon,
    custom_schema_spec: { subtype: GITHUB_ISSUE_SUBTYPE },
  });

  const result = {
    ok: true,
    issue_id: issueId,
    issue_don: issue.id,
    subtype: 'devrev-d-demo/Issues',
    subtype_set: subtypeRes.status < 400,
    affected_version: affectedVersion,
    incident_date: incidentDate,
    tags: tagNames,
    ticket_id: ticketId || null,
    link: null,
    ticket_cf: null,
  };
  if (subtypeRes.status >= 400) {
    result.subtype_error = subtypeRes.data;
  }

  if (ticketId) {
    // dual-write CF on live Ticket (version / incident date)
    const ticketUpdate = await devrevPost(pat, 'works.update', {
      id: ticketId,
      custom_schema_fragments: [TICKET_FRAGMENT],
      custom_fields: {
        tnt__affected_version: affectedVersion,
        tnt__incident_date: incidentDate,
      },
    });
    result.ticket_cf =
      ticketUpdate.status < 400
        ? 'updated'
        : { error: ticketUpdate.data, status: ticketUpdate.status };

    // Ticket → Issue: is_dependent_on（ticket→issue で許可されるリンク）
    const linkRes = await devrevPost(pat, 'links.create', {
      link_type: 'is_dependent_on',
      source: ticketId,
      target: issueId,
    });
    result.link =
      linkRes.status < 400
        ? { ok: true, link_type: 'is_dependent_on' }
        : { ok: false, status: linkRes.status, error: linkRes.data };
  }

  return json(res, 200, result);
};
