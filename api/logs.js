/**
 * UC4 dummy log API — fixtures from UC4_データ設計.md §9
 * GET /api/logs?error=E-517&module=edi&date=2026-07-14
 */

const DEFAULT_DATE = '2026-07-14';

const FIXTURES = {
  'E-517': {
    error_code: 'E-517',
    module: 'edi',
    feature: 'サプライヤEDI連携',
    timestamp: '2026-07-14T02:03:15+09:00',
    batch_id: 'EDI-NIGHTLY-20260714',
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
    hint: 'records=12480 exceeds typical volume; timeout=30s',
  },
  'E-402': {
    error_code: 'E-402',
    module: 'rop',
    feature: '発注点計算',
    timestamp: '2026-07-14T10:15:22+09:00',
    batch_id: null,
    level: 'ERROR',
    logs: [
      {
        ts: '10:15:22',
        level: 'ERROR',
        msg: 'E-402 ROP calc failed. supplier=SUP-3310 leadTime=null',
      },
    ],
    hint: 'leadTime is null — master data issue',
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
    hint: 'renew AS2 client certificate',
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
    hint: 'timeout under high volume; consider paging',
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
  const date = url.searchParams.get('date') || DEFAULT_DATE;

  if (!error) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'missing_error_param' }));
    return;
  }

  const fixture = FIXTURES[error];
  if (!fixture) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        error_code: error,
        module: moduleParam || null,
        feature: null,
        timestamp: `${date}T00:00:00+09:00`,
        batch_id: null,
        level: 'INFO',
        logs: [],
        hint: 'no matching fixture',
      })
    );
    return;
  }

  // error wins over module mismatch (§9.2)
  const body = { ...fixture, requested_module: moduleParam || null, requested_date: date };
  res.statusCode = 200;
  res.end(JSON.stringify(body));
};
