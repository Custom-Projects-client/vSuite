import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MailService } from '../../core/mail.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Contact form used on several pages: <app-contact-form />
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
})
export class ContactForm implements OnInit {
  // 'default' = original fields. 'team' / 'clients' = vSuite wording (see contact-form.html)
  @Input() variant: 'default' | 'team' | 'clients' = 'default';

  private fb = inject(FormBuilder);

  // Fields + rules. Add a field here AND in the html.
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    website: ['', Validators.required],
    message: ['', Validators.required],
    company: [''],
    interest: [''],
  });

  readonly interests = [
    'vSuite Finance — Billing & Accounting',
    'vSuite Workforce — HR & Payroll',
    'vSuite Commerce — E-Commerce',
    'vSuite Logistics — ProcessFlow',
    'AI & Automation',
    'System Integration',
    'Other',
  ];

  ngOnInit() {
    // the vSuite variants have no Website field
    if (this.variant !== 'default') this.form.controls.website.clearValidators();
    this.form.controls.website.updateValueAndValidity();
  }

  private mail = inject(MailService);
  status = signal<'idle' | 'error' | 'sending' | 'sent' | 'failed'>('idle');

  // Red tip shows only after the field was touched / submit tried
  invalid(field: 'name' | 'email' | 'website' | 'message') {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || this.status() === 'error');
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('error');
      return;
    }
    if (this.status() === 'sending') return;
    this.status.set('sending');
    const v = this.form.getRawValue();
    const ok = await this.mail.send(`Website enquiry (${this.variant}) from ${v.name}`, {
      Name: v.name,
      Email: v.email,
      Company: v.company,
      'Area of interest': v.interest,
      Website: v.website,
      Message: v.message,
    });
    this.status.set(ok ? 'sent' : 'failed');
    if (ok) this.form.reset();
  }
}
