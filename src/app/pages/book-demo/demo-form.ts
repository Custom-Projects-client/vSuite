import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MailService } from '../../core/mail.service';

// Book a Demo form. Fields: name, email, phone, company, product of interest, description.
// Sent to info@vishvadigitaltechnologies.com through core/mail.service.ts.
// "?product=billing" in the URL pre-selects a product (the product pages use this).
@Component({
  selector: 'app-demo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './demo-form.html',
})
export class DemoForm implements OnInit {
  private mail = inject(MailService);
  private route = inject(ActivatedRoute);

  readonly products = [
    { key: 'billing', label: 'vSuite Billing' },
    { key: 'accounting', label: 'vSuite Accounting' },
    { key: 'hr', label: 'vSuite Human Resources' },
    { key: 'payroll', label: 'vSuite Payroll' },
    { key: 'ecommerce', label: 'vSuite E-Commerce' },
    { key: 'processflow', label: 'vSuite ProcessFlow' },
    { key: 'hospital', label: 'vSuite Hospital Management' },
    { key: 'all', label: 'All vSuite products' },
    { key: 'unsure', label: 'Not sure yet' },
  ];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[0-9][0-9\s\-()]{6,18}$/)],
    }),
    company: new FormControl('', { nonNullable: true }),
    product: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    details: new FormControl('', { nonNullable: true }),
  });
  status = signal<'idle' | 'invalid' | 'sending' | 'sent' | 'fallback'>('idle');

  ngOnInit() {
    const wanted = this.route.snapshot.queryParamMap.get('product');
    const hit = this.products.find((p) => p.key === wanted);
    if (hit) this.form.controls.product.setValue(hit.label);
  }

  bad(f: 'name' | 'email' | 'phone' | 'product') {
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
    const subject = `Demo request: ${v.product} (${v.name})`;
    const fields = {
      Name: v.name,
      Email: v.email,
      Phone: v.phone,
      Company: v.company,
      'Product of interest': v.product,
      'Details / requirements': v.details,
    };
    const ok = await this.mail.send(subject, fields);
    if (ok) {
      this.status.set('sent');
      this.form.reset({ name: '', email: '', phone: '', company: '', product: '', details: '' });
    } else {
      this.status.set('fallback');
      this.mail.openMailClient(subject, fields);
    }
  }
}
