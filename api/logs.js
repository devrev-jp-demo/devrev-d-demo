/**
 * UC4 dummy log API — raw-ish fixtures (no interpretive "hint" field).
 * GET /api/logs?error=E-517&module=edi&version=v3.0&date=YYYY-MM-DD
 *
 * Date policy:
 * - Default date = the day this API is GET (Asia/Tokyo).
 * - Optional `date=` query overrides that day (Agent may pass incident_date).
 * - E-517 v1.0 keeps the historical fixture date (2024-03-15).
 *
 * Anti-cheat: do not return root-cause conclusions, remediation advice,
 * or labels like "regression". Agent must infer from logs + KG only.
 */

const DEFAULT_E517_VERSION = 'v3.0';
const E517_V1_DATE = '2024-03-15';

/** @returns {{ date: string, batchDay: string }} YYYY-MM-DD / YYYYMMDD in Asia/Tokyo */
function jstDay(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const date = fmt.format(now); // en-CA → YYYY-MM-DD
  return { date, batchDay: date.replaceAll('-', '') };
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** E-517 log lines only — same operational symptoms for v1.0 and v3.0. */
function buildE517Fixture(version, requestDate) {
  const isV1 = version === 'v1.0';
  const date = isV1 ? E517_V1_DATE : requestDate;
  const batchDay = date.replaceAll('-', '');
  return {
    error_code: 'E-517',
    module: 'edi',
    feature: 'サプライヤEDI連携',
    version,
    timestamp: `${date}T02:03:15+09:00`,
    batch_id: `EDI-NIGHTLY-${batchDay}`,
    level: 'ERROR',
    logs: [
      { ts: '02:00:01', level: 'INFO', msg: 'EDI nightly batch started. supplier=SUP-8842' },
      { ts: '02:00:05', level: 'INFO', msg: 'SFTP connect ok. fetching order data...' },
      { ts: '02:00:35', level: 'WARN', msg: 'Response slow. elapsed=30s (timeout threshold)' },
      { ts: '02:00:35', level: 'ERROR', msg: 'java.net.SocketTimeoutException: Read timed out' },
      {
        ts: '02:00:35',
        level: 'ERROR',
        msg: 'E-517 EDI import failed. batch aborted. records_processed=0/12480',
      },
    ],
  };
}

const FIXTURES = {
  'E-402': {
    error_code: 'E-402',
    module: 'rop',
    feature: '発注点計算',
    stamp_with_request_date: true,
    time: '10:15:22',
    batch_id: null,
    level: 'ERROR',
    logs: [
      {
        ts: '10:15:22',
        level: 'ERROR',
        msg: 'E-402 ROP calc failed. supplier=SUP-3310 leadTime=null',
      },
    ],
  },
  'E-511': {
    error_code: 'E-511',
    module: 'edi',
    feature: 'サプライヤEDI連携',
    timestamp: '2026-04-03T02:00:12+09:00',
    batch_id: 'EDI-NIGHTLY-20260403',
    level: 'ERROR',
    logs: [
      {
        ts: '02:00:08',
        level: 'ERROR',
        msg: 'AS2 certificate validation failed: certificate expired',
      },
      {
        ts: '02:00:08',
        level: 'ERROR',
        msg: 'E-511 EDI connect aborted. supplier=SUP-8842',
      },
    ],
  },
  'E-512': {
    error_code: 'E-512',
    module: 'acc',
    feature: '会計システム連携',
    timestamp: '2026-05-12T01:20:44+09:00',
    batch_id: 'ACC-SYNC-20260512',
    level: 'ERROR',
    logs: [
      {
        ts: '01:20:40',
        level: 'ERROR',
        msg: 'java.net.SocketTimeoutException: Read timed out',
      },
      {
        ts: '01:20:40',
        level: 'ERROR',
        msg: 'E-512 accounting API sync failed. records_processed=0/8200',
      },
    ],
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function normalizeVersion(raw) {
  if (!raw) return null;
  const v = String(raw).trim().toLowerCase();
  // Agent sometimes passes Status API aliases instead of vX.Y
  if (v in { latest: 1, current: 1, production: 1, prod: 1, production_version: 1 }) {
    return DEFAULT_E517_VERSION;
  }
  if (v === 'v1.0' || v === '1.0') return 'v1.0';
  if (v === 'v3.0' || v === '3.0') return 'v3.0';
  if (v === 'v1.2' || v === '1.2') return 'v1.2';
  if (v === 'v2.0' || v === '2.0') return 'v2.0';
  return String(raw).trim();
}

function emptyFixture(error, moduleParam, version, date) {
  return {
    error_code: error,
    module: moduleParam || null,
    feature: null,
    version: version || null,
    timestamp: `${date}T00:00:00+09:00`,
    batch_id: null,
    level: 'INFO',
    logs: [],
  };
}

function stampFixture(fixture, date) {
  const { stamp_with_request_date, time, ...rest } = fixture;
  if (!stamp_with_request_date) return { ...rest };
  const hhmmss = time || '00:00:00';
  return {
    ...rest,
    timestamp: `${date}T${hhmmss}+09:00`,
  };
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

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const error = url.searchParams.get('error');
  const moduleParam = url.searchParams.get('module');
  const version = normalizeVersion(url.searchParams.get('version'));
  const today = jstDay().date;
  const dateParam = url.searchParams.get('date');
  const date = isIsoDate(dateParam) ? dateParam : today;

  if (!error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'missing_error_param' }));
    return;
  }

  if (error === 'E-517') {
    const ver = version || DEFAULT_E517_VERSION;
    if (ver !== 'v1.0' && ver !== 'v3.0') {
      res.statusCode = 200;
      res.end(JSON.stringify(emptyFixture('E-517', moduleParam || 'edi', ver, date)));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(buildE517Fixture(ver, date)));
    return;
  }

  const fixture = FIXTURES[error];
  if (!fixture) {
    res.statusCode = 200;
    res.end(JSON.stringify(emptyFixture(error, moduleParam, version, date)));
    return;
  }

  const body = stampFixture(fixture, date);
  if (version) body.version = version;
  res.statusCode = 200;
  res.end(JSON.stringify(body));
};
