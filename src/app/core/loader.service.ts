import { Injectable, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

const MIN_VISIBLE_MS = 450; // loader is always visible at least this long (no flicker)
const MAX_VISIBLE_MS = 10000; // safety: never block the page longer than this

// Shows the full-screen loader on the first load and on every navigation.
// Pages that load slow content (e.g. an iframe) can hold it with begin()/end().
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private router = inject(Router);
  readonly visible = signal(false);

  private holds = new Set<string>();
  private shownAt = 0;
  private hideTimer: ReturnType<typeof setTimeout> | undefined;
  private safetyTimer: ReturnType<typeof setTimeout> | undefined;
  private firstNavigationDone = false;
  private windowLoaded = document.readyState === 'complete';

  constructor() {
    if (!this.windowLoaded) {
      window.addEventListener('load', () => {
        this.windowLoaded = true;
        this.removeInitialLoader();
      });
    }
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        if (this.firstNavigationDone) this.begin('nav');
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        if (!this.firstNavigationDone) {
          // first load: don't wait for every image - the page is usable shortly after it renders
          setTimeout(() => { this.windowLoaded = true; this.removeInitialLoader(); }, 1500);
        }
        this.firstNavigationDone = true;
        this.end('nav');
        this.removeInitialLoader();
      }
    });
  }

  begin(key: string) {
    this.holds.add(key);
    clearTimeout(this.hideTimer);
    if (!this.visible()) {
      this.shownAt = Date.now();
      this.visible.set(true);
    }
    clearTimeout(this.safetyTimer);
    this.safetyTimer = setTimeout(() => {
      this.holds.clear();
      this.hide();
    }, MAX_VISIBLE_MS);
  }

  end(key: string) {
    this.holds.delete(key);
    if (this.holds.size > 0) return;
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - this.shownAt));
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => this.hide(), wait);
  }

  private hide() {
    clearTimeout(this.safetyTimer);
    this.visible.set(false);
  }

  // The first-load loader lives in index.html (visible before Angular starts).
  private removeInitialLoader() {
    if (!this.firstNavigationDone || !this.windowLoaded) return;
    const el = document.getElementById('app-initial-loader');
    if (!el) return;
    const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
    setTimeout(() => {
      el.classList.add('vs-loader-hide');
      setTimeout(() => el.remove(), 400);
    }, wait);
  }
}
