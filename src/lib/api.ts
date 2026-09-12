function getAuthHeader(): Record<string, string> {
  try {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

async function parseError(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (_) {
    return { error: text };
  }
}

export async function getJson(path: string) {
  const headers: Record<string, string> = { ...getAuthHeader() };
  const res = await fetch(path, { headers: headers as HeadersInit });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { throw new Error(text || 'Unexpected non-JSON response'); }
}

export async function postJson(path: string, body: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const res = await fetch(path, { method: 'POST', headers: headers as HeadersInit, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || { ok: true }; }
}

export async function putJson(path: string, body: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const res = await fetch(path, { method: 'PUT', headers: headers as HeadersInit, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || { ok: true }; }
}

export async function deleteJson(path: string, body?: any) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const opts: any = { method: 'DELETE', headers: headers as HeadersInit };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || { ok: true }; }
}
