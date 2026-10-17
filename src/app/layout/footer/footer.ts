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

  async subscribe(event: Event) {
    event.preventDefault();
    if (this.email.invalid || this.sending()) return;
    this.sending.set(true);
    const ok = await this.mail.send('Newsletter subscription', { Email: this.email.value });
    this.sending.set(false);
    if (ok) {
      this.subscribed.set(true);
      this.email.reset();
    }
  }
}
