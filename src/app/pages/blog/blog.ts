import { Component, inject, signal } from '@angular/core';
import { MailService } from '../../core/mail.service';
import { PAGE_IMPORTS } from '../../shared/page-imports';

// Blog page  ->  route "/blog"
// - Markup lives in blog.html (edit text/images there)
@Component({
  selector: 'app-blog',
  imports: PAGE_IMPORTS,
  templateUrl: './blog.html',
})
export class Blog {
  private mail = inject(MailService);
  newsletter = signal<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  async subscribe(event: Event, email: string) {
    event.preventDefault();
    if (!email || this.newsletter() === 'sending') return;
    this.newsletter.set('sending');
    const ok = await this.mail.send('Newsletter subscription (Blog page)', { Email: email });
    this.newsletter.set(ok ? 'sent' : 'failed');
  }
}
