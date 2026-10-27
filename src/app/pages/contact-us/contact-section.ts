import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailService } from '../../core/mail.service';

// Contact details + message form (Contact Us page). Messages go to info@vishvadigitaltechnologies.com (see core/mail.service.ts)
@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-section.html',
})
export class ContactSection {
  private mail = inject(MailService);
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    subject: new FormControl('', { nonNullable: true }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  status = signal<'idle' | 'invalid' | 'sending' | 'sent' | 'fallback'>('idle');

  bad(f: 'name' | 'email' | 'message') {
    const c = this.form.controls[f];
    return c.invalid && (c.touched || this.status() === 'invalid');
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('invalid');
      return;
    }
    if (this.status() === 'sending') return;
    this.status.set('sending');
    const v = this.form.getRawValue();
    const subject = `Website contact: ${v.subject || 'New message'} (${v.name})`;
    const fields = { Name: v.name, Email: v.email, Subject: v.subject, Message: v.message };
    const ok = await this.mail.send(subject, fields);
    if (ok) {
      this.status.set('sent');
      this.form.reset();
    } else {
      // the form service could not take it: hand the message to the visitor's e-mail app instead
      this.status.set('fallback');
      this.mail.openMailClient(subject, fields);
    }
  }
}
