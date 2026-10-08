import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { ageRanges, attendance, merch, type MerchKey, type YouthSignup } from '@/content/youthWeek';

/**
 * Youth Week sign-ups.
 *
 * Set YOUTH_SIGNUP_WEBHOOK to the Google Apps Script web-app URL
 * (scripts/youth-signup-sheet.gs) and every sign-up lands as a row in a Google Sheet.
 * Without it, `next dev` appends to data/youth-signups.jsonl so the form can be tested locally.
 */

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneOf = (v: unknown, allowed: readonly string[]) => (typeof v === 'string' && allowed.includes(v) ? v : '');
const manyOf = <T extends string>(v: unknown, allowed: readonly T[]) =>
  Array.isArray(v) ? allowed.filter((a) => v.includes(a)) : [];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (text(body.website, 200)) return Response.json({ ok: true });

  const signup: YouthSignup = {
    name: text(body.name, 120),
    phone: text(body.phone, 30),
    email: text(body.email, 160),
    ageRange: oneOf(body.ageRange, ageRanges),
    attendance: oneOf(body.attendance, attendance),
    merch: manyOf<MerchKey>(body.merch, merch.map((m) => m.key)),
    note: text(body.note, 1000),
  };

  if (signup.name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  if (signup.phone.replace(/\D/g, '').length < 7) {
    return Response.json({ error: 'Please enter a phone number we can reach you on.' }, { status: 400 });
  }
  if (signup.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email)) {
    return Response.json({ error: 'That email address does not look right.' }, { status: 400 });
  }
  const record = { submittedAt: new Date().toISOString(), ...signup };
  const webhook = process.env.YOUTH_SIGNUP_WEBHOOK;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
    } else if (process.env.NODE_ENV !== 'production') {
      const dir = path.join(process.cwd(), 'data');
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, 'youth-signups.jsonl'), JSON.stringify(record) + '\n');
    } else {
      throw new Error('YOUTH_SIGNUP_WEBHOOK is not set');
    }
  } catch (err) {
    console.error('[youth-signup]', err);
    return Response.json(
      { error: 'We could not save your details just now. Please try again in a moment.' },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
