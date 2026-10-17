import { Component, inject } from '@angular/core';
import { LoaderService } from '../../core/loader.service';

// Full-screen loader overlay (styles: .vs-loader in src/index.html)
@Component({
  selector: 'app-loader',
  template: `
    <div class="vs-loader" [class.vs-loader-hide]="!loader.visible()" role="status" aria-live="polite" aria-label="Loading">
      <div class="vs-loader-ring"></div>
    </div>
  `,
})
export class Loader {
  loader = inject(LoaderService);
}
