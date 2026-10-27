import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailService } from '../../core/mail.service';
import { RouterLink } from '@angular/router';

import { Fullwidth } from '../../shared/directives/fullwidth';

// Footer markup is in footer.html (3 blocks: info strip, widgets, copyright bar).
@Component({
  selector: 'app-footer',
  imports: [RouterLink, ReactiveFormsModule, Fullwidth],
  templateUrl: './footer.html',
})
export class Footer {
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  subscribed = signal(false);

  private mail = inject(MailService);
  sending = signal(false);

  note = signal<'' | 'invalid' | 'fallback'>('');

  async subscribe(event: Event) {
    event.preventDefault();
    this.note.set('');
    if (this.sending()) return;
    if (this.email.invalid) {
      this.email.markAsTouched();
      this.note.set('invalid');
      return;
    }
    this.sending.set(true);
    const fields = { Email: this.email.value };
    const ok = await this.mail.send('Newsletter subscription', fields);
    this.sending.set(false);
    if (ok) {
      this.subscribed.set(true);
      this.email.reset();
    } else {
      // the form service could not take it: hand the sign-up to the visitor's e-mail app instead
      this.note.set('fallback');
      this.mail.openMailClient('Newsletter subscription', fields);
    }
  }
}
