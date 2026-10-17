import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../core/loader.service';

// Shows one product module (a standalone HTML page in public/assets/products/) under the site header.
// The route supplies the file via data.src. The page keeps its own design, scripts and scrolling.
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.html',
})
export class ProductView implements OnDestroy {
  private loader = inject(LoaderService);
  private router = inject(Router);
  src: SafeResourceUrl;

  constructor() {
    const file = inject(ActivatedRoute).snapshot.data['src'] as string;
    this.src = inject(DomSanitizer).bypassSecurityTrustResourceUrl(file);
    this.loader.begin('frame'); // keep the loader up until the module page has loaded
  }

  // The product page (inside the iframe) asks us to open another route: related products, Request a Demo, Contact.
  @HostListener('window:message', ['$event'])
  onFrameMessage(e: MessageEvent) {
    if (e.origin !== window.location.origin) return;
    const route = e.data && (e.data as { vsNav?: unknown }).vsNav;
    if (typeof route === 'string' && route.startsWith('/') && !route.startsWith('//')) {
      this.router.navigateByUrl(route);
    }
  }

  onLoad() {
    this.loader.end('frame');
  }

  ngOnDestroy() {
    this.loader.end('frame');
  }
}
