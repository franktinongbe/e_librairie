function getAuthHeader() {
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
  const headers = { ...getAuthHeader() };
  const res = await fetch(path, { headers });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  return res.json();
}

export async function postJson(path: string, body: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  return res.json();
}

export async function putJson(path: string, body: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const res = await fetch(path, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  return res.json();
}

export async function deleteJson(path: string, body?: any) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
  const opts: any = { method: 'DELETE', headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) {
    const err = await parseError(res);
    throw new Error(err.error || JSON.stringify(err) || res.statusText);
  }
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text || { ok: true }; }
}
