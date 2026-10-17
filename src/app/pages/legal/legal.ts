import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAGE_IMPORTS } from '../../shared/page-imports';

// Legal pages  ->  routes "/privacy-policy" and "/terms" (route data: { doc: 'privacy' | 'terms' })
// - Text lives in legal.html. Have it reviewed by your legal adviser before publishing.
@Component({
  selector: 'app-legal',
  imports: [...PAGE_IMPORTS],
  templateUrl: './legal.html',
})
export class Legal {
  doc: 'privacy' | 'terms' = inject(ActivatedRoute).snapshot.data['doc'] === 'terms' ? 'terms' : 'privacy';

  // banner title is split so the last two letters keep the theme's cyan / purple colouring
  head = this.doc === 'terms' ? 'terms of ' : 'privacy poli';
  mid = this.doc === 'terms' ? 'u' : 'c';
  end = this.doc === 'terms' ? 'se' : 'y';
  intro =
    this.doc === 'terms'
      ? 'The simple rules for using the vSuite website.'
      : 'How Vishva Digital Technologies handles your information.';
}
