import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BLOG_ARTICLES, BlogArticle } from './blog-articles';

// Blog article page  ->  route "/blog/:slug"
// - The text of every article lives in blog-articles.ts (edit / add articles there)
// - Layout: reading-progress bar, "In this article" contents list, comfortable text column,
//   key-principle box, call to action and "continue reading" cards.
@Component({
  selector: 'app-blog-article',
  imports: [RouterLink],
  templateUrl: './blog-article.html',
})
export class BlogArticlePage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private sub?: Subscription;
  private ticking = false;

  article = signal<BlogArticle | null>(null);
  progress = signal(0);
  active = signal('');

  toc = computed(() =>
    (this.article()?.blocks ?? []).filter((b) => b.t === 'h2').map((b) => ({ id: b.id ?? '', text: b.text ?? '' })),
  );

  // the three articles that follow this one in the blog list (wraps around)
  more = computed(() => {
    const a = this.article();
    if (!a) return [];
    const i = BLOG_ARTICLES.findIndex((x) => x.slug === a.slug);
    return [1, 2, 3].map((n) => BLOG_ARTICLES[(i + n) % BLOG_ARTICLES.length]);
  });

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe((p) => {
      const found = BLOG_ARTICLES.find((x) => x.slug === p.get('slug'));
      if (!found) {
        this.router.navigateByUrl('/blog');
        return;
      }
      this.article.set(found);
      this.title.setTitle(found.title + ' | vSuite');
      this.progress.set(0);
      this.active.set(this.toc()[0]?.id ?? '');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  /** "01", "02" ... number shown in front of each section heading */
  num(id: string | undefined): string {
    const i = this.toc().findIndex((h) => h.id === id);
    return String(i + 1).padStart(2, '0');
  }

  goTo(id: string, event: Event) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // links inside the article text that point to pages of this website stay inside the app
  onBodyClick(event: MouseEvent) {
    const a = (event.target as HTMLElement).closest('a');
    const href = a?.getAttribute('href') ?? '';
    if (a && href.startsWith('/') && !href.startsWith('//')) {
      event.preventDefault();
      this.router.navigateByUrl(href);
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const body = document.getElementById('vsaBody');
      if (!body) return;
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      this.progress.set(Math.max(0, Math.min(100, Math.round((-r.top / total) * 100))));
      let current = this.toc()[0]?.id ?? '';
      for (const h of this.toc()) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 150) current = h.id;
      }
      if (current !== this.active()) this.active.set(current);
    });
  }
}
