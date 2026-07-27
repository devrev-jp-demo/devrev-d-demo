/**
 * UC4: Ticket/Conversation created → run ai_agent-4 → post external timeline comment.
 *
 * GET/POST /api/uc4-triage
 *   ticket_id=TKT-26 | conversation_id=CONV-2 | id=<either>
 *   secret=<UC4_TRIAGE_SECRET> (query or X-UC4-Secret)
 *
 * Env: DEVREV_PAT (required), UC4_TRIAGE_SECRET (optional), AGENT_ID (optional)
 */

const BASE = 'https://api.devrev.ai';
const AGENT = process.env.AGENT_ID || 'ai_agent-4';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8') || '{}';
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

async function devrevPost(pat, path, body) {
  const r = await fetch(`${BASE}${path}`, {
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

async function executeSync(pat, parentId, message) {
  const r = await fetch(`${BASE}/internal/ai-agents.events.execute-sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agent: AGENT,
      parent: parentId,
      session_object: `uc4-triage-${Date.now()}`,
      event: { input_message: { message } },
    }),
  });
  const raw = await r.text();
  const msgs = [];
  for (const line of raw.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    try {
      const d = JSON.parse(line.slice(6));
      if (d && typeof d === 'object' && 'message' in d) {
        msgs.push(String(d.message));
      }
    } catch {
      /* ignore partial SSE */
    }
  }
  return { status: r.status, reply: msgs.length ? msgs[msgs.length - 1] : '', raw };
}

function looksLikeConversation(id) {
  const s = String(id || '');
  return /^CONV-\d+/i.test(s) || s.includes(':conversation/');
}

async function loadTicket(pat, id) {
  const got = await devrevPost(pat, '/works.get', { id });
  if (got.status >= 400 || !got.data.work) {
    return { error: 'works.get failed', detail: got.data };
  }
  const work = got.data.work;
  return {
    kind: 'ticket',
    id: work.id,
    displayId: work.display_id || id,
    title: work.title || '',
    body: work.body || '',
  };
}

async function firstUserComment(pat, objectId) {
  const listed = await devrevPost(pat, '/timeline-entries.list', {
    object: objectId,
    limit: 50,
  });
  const entries = (listed.data && listed.data.timeline_entries) || [];
  for (const e of entries) {
    if (e.type !== 'timeline_comment') continue;
    const body = (e.body || '').trim();
    if (!body) continue;
    if (body.startsWith('【UC4 Incident Triage Agent】')) continue;
    return body;
  }
  return '';
}

async function loadConversation(pat, id) {
  const got = await devrevPost(pat, '/conversations.get', { id });
  if (got.status >= 400 || !got.data.conversation) {
    return { error: 'conversations.get failed', detail: got.data };
  }
  const conv = got.data.conversation;
  const body = await firstUserComment(pat, conv.id);
  return {
    kind: 'conversation',
    id: conv.id,
    displayId: conv.display_id || id,
    title: conv.title || '',
    body,
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== 'POST' && req.method !== 'GET') {
    return json(res, 405, { error: 'GET or POST' });
  }

  const pat = process.env.DEVREV_PAT;
  if (!pat) {
    return json(res, 500, { error: 'DEVREV_PAT not configured' });
  }

  const url = new URL(req.url, 'http://localhost');
  const secret = process.env.UC4_TRIAGE_SECRET;
  if (secret) {
    const got = req.headers['x-uc4-secret'] || url.searchParams.get('secret');
    if (got !== secret) {
      return json(res, 401, { error: 'unauthorized' });
    }
  }

  let body = {};
  if (req.method === 'POST') {
    try {
      body = await readBody(req);
    } catch {
      return json(res, 400, { error: 'invalid json' });
    }
  }

  const objectId =
    body.conversation_id ||
    body.ticket_id ||
    body.id ||
    body.ticket ||
    body.conversation ||
    url.searchParams.get('conversation_id') ||
    url.searchParams.get('ticket_id') ||
    url.searchParams.get('id');
  if (!objectId) {
    return json(res, 400, { error: 'ticket_id or conversation_id required' });
  }

  const loaded = looksLikeConversation(objectId)
    ? await loadConversation(pat, objectId)
    : await loadTicket(pat, objectId);
  if (loaded.error) {
    return json(res, 502, loaded);
  }

  const label = loaded.kind === 'conversation' ? 'Conversation' : 'Ticket';
  const message =
    `【トリアージ】${label} ${loaded.displayId}\n件名: ${loaded.title}\n本文:\n${loaded.body}\n\n` +
    'Issue/KB を確認し、判定ラベルと顧客向け返信を日本語で作成してください。';

  const exec = await executeSync(pat, loaded.displayId, message);
  if (exec.status >= 400 || !exec.reply) {
    return json(res, 502, {
      error: 'agent execute-sync failed',
      status: exec.status,
      snip: (exec.raw || '').slice(0, 500),
    });
  }

  const commentBody =
    `【UC4 Incident Triage Agent】\n\n${exec.reply.trim()}\n\n` +
    `_auto: ${loaded.kind}-created triage_`;

  const posted = await devrevPost(pat, '/timeline-entries.create', {
    type: 'timeline_comment',
    object: loaded.id,
    body: commentBody,
    visibility: 'external',
    external_ref: `uc4-triage:${loaded.displayId}:${Date.now()}`,
  });

  if (posted.status >= 400) {
    return json(res, 502, {
      error: 'timeline-entries.create failed',
      detail: posted.data,
      reply_len: exec.reply.length,
    });
  }

  return json(res, 200, {
    ok: true,
    kind: loaded.kind,
    object: loaded.displayId,
    comment_id: (posted.data.timeline_entry || {}).id,
    reply_len: exec.reply.length,
  });
};
