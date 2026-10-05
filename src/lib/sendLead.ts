const LEADS_URL = (import.meta.env.VITE_LEADS_URL as string | undefined) ||
  'https://script.google.com/macros/s/AKfycbzAuhhJo8r4s5rJlFAGRDyoniIW3xXSKWcEffl1cD7M7EJvTvRx-DJ489r9mhU5b6OJnQ/exec';

export async function sendLead(fields: Record<string, string | number>): Promise<boolean> {
  if (!LEADS_URL) return false;
  try {
    // text/plain avoids a CORS preflight, which Apps Script web apps do not answer
    const res = await fetch(LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}
