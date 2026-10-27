import { Injectable } from '@angular/core';

// Sends website form messages (contact + demo requests + newsletter) to info@vishvadigitaltechnologies.com.
//
// Default: FormSubmit.co (no backend). It only delivers AFTER the address has been activated once:
// the first message makes FormSubmit email info@vishvadigitaltechnologies.com an "Activate Form" link
// (check Spam too). Until that link is clicked, FormSubmit answers { success: "false" } - that is the
// "success: false" you see in the browser Network tab. The reason is in the response "message", and is
// also printed in the browser console by this service.
//
// Optional (more reliable, no activation e-mail): create a free access key at https://web3forms.com
// for info@vishvadigitaltechnologies.com and paste it below. When a key is set it is used instead of FormSubmit.
const RECIPIENT = 'info@vishvadigitaltechnologies.com';
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/' + RECIPIENT;
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = ''; // e.g. '1a2b3c4d-....' (leave empty to use FormSubmit)

@Injectable({ providedIn: 'root' })
export class MailService {
  /**
   * Last resort when the form service is not reachable / not activated yet:
   * opens the visitor's e-mail app with the message already written, addressed to the company mailbox.
   */
  openMailClient(subject: string, fields: Record<string, string | null | undefined>): void {
    const lines = Object.entries(fields)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}: ${v}`);
    const href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    window.location.href = href;
  }

  /** Why the last send failed (for debugging; also logged to the console). */
  lastError = '';

  /** Resolves true when the message was accepted for delivery. */
  async send(subject: string, fields: Record<string, string | null | undefined>): Promise<boolean> {
    this.lastError = '';
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(fields)) if (v) clean[k] = String(v);

    const useWeb3 = WEB3FORMS_KEY.length > 0;
    const body: Record<string, string | boolean> = useWeb3
      ? { access_key: WEB3FORMS_KEY, subject, from_name: clean['Name'] ?? 'Website visitor', ...clean, botcheck: '' }
      : { _subject: subject, _template: 'table', _captcha: 'false', _honey: '', ...clean };
    if (clean['Email'] && !useWeb3) body['_replyto'] = clean['Email'];
    if (clean['Email'] && useWeb3) body['email'] = clean['Email'];

    try {
      const res = await fetch(useWeb3 ? WEB3FORMS_ENDPOINT : FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && String(data.success) === 'true';
      if (!ok) {
        this.lastError = String(data.message || 'HTTP ' + res.status);
        console.error('[vSuite mail] message was not sent:', this.lastError, data);
      }
      return ok;
    } catch (err) {
      this.lastError = 'Network error: ' + (err instanceof Error ? err.message : String(err));
      console.error('[vSuite mail]', this.lastError);
      return false;
    }
  }
}
