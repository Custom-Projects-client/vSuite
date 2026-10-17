import { Injectable } from '@angular/core';

// Sends website form messages to info@vishvadigitaltechnologies.com.
// Uses the FormSubmit.co endpoint (no backend needed). First-time setup: the first message triggers an
// activation email to the address below - click "Activate" once and all later messages arrive normally.
const RECIPIENT = 'info@vishvadigitaltechnologies.com';
const ENDPOINT = 'https://formsubmit.co/ajax/' + RECIPIENT;

@Injectable({ providedIn: 'root' })
export class MailService {
  /** Resolves true when the message was accepted for delivery. */
  async send(subject: string, fields: Record<string, string | null | undefined>): Promise<boolean> {
    const body: Record<string, string> = { _subject: subject, _template: 'table', _captcha: 'false' };
    for (const [k, v] of Object.entries(fields)) if (v) body[k] = String(v);
    if (fields['Email']) body['_replyto'] = String(fields['Email']);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      return res.ok && String(data.success) === 'true';
    } catch {
      return false;
    }
  }
}
