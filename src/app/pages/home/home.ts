import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { PAGE_IMPORTS } from '../../shared/page-imports';

type HeroChar = { c: string; i: number; side: 'l' | 'r' };
type HeroWord = { chars: HeroChar[] };

// Splits a headline into words and letters so each letter can animate (fly in from left/right, jump on hover)
function splitHeadline(text: string, side: (wordIndex: number, charIndex: number) => 'l' | 'r'): HeroWord[] {
  let n = 0;
  return text.split(' ').map((w, wi) => ({
    chars: [...w].map((c) => {
      const i = n++;
      return { c, i, side: side(wi, i) };
    }),
  }));
}

// Home page  ->  route "/"
// - Markup lives in home.html (edit text/images there)
// - Hero: headline text, product logo cards and the animated network are defined below
@Component({
  selector: 'app-home',
  imports: PAGE_IMPORTS,
  templateUrl: './home.html',
})
export class Home implements AfterViewInit, OnDestroy {
  private zone = inject(NgZone);
  @ViewChild('hxNet') private netRef?: ElementRef<HTMLCanvasElement>;
  private stopNet?: () => void;
  private mouse = { x: -9999, y: -9999 };

  // line 1: letters alternate - one flies in from the left, the next from the right
  hero1 = splitHeadline('ONE SUITE.', (_w, i) => (i % 2 === 0 ? 'l' : 'r'));
  // line 2: first two words come from the left, last two from the right
  hero2 = splitHeadline('MULTIPLE SOLUTIONS. INTELLIGENTLY CONNECTED.', (w) => (w < 2 ? 'l' : 'r'));

  // logo cards under the buttons (each opens its product page)
  heroProducts = [
    { name: 'Finance', tag: 'Finance, Simplified for Growth', logo: 'assets/uploads/vsuite/logo-finance.jpg', link: '/product/vsuite-finance' },
    { name: 'Workforce', tag: 'People. Potential. Performance.', logo: 'assets/uploads/vsuite/logo-workforce.jpg', link: '/product/vsuite-workforce' },
    { name: 'Commerce', tag: 'Sell. Manage. Grow.', logo: 'assets/uploads/vsuite/logo-commerce.jpg', link: '/product/vsuite-commerce' },
    { name: 'Logistics', tag: 'Logistics, Perfectly orchestrated', logo: 'assets/uploads/vsuite/logo-logistics.jpg', link: '/product/vsuite-logistics' },
    { name: 'Healthcare', tag: 'Care, Connected.', logo: 'assets/uploads/vsuite/logo-healthcare.jpg', link: '/product/vsuite-healthcare' },
  ];

  // mouse movement: moves the spotlight and emblem, and attracts the network lines
  heroMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--px', (x - 0.5).toFixed(3));
    el.style.setProperty('--py', (y - 0.5).toFixed(3));
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    this.mouse.x = e.clientX - r.left;
    this.mouse.y = e.clientY - r.top;
  }

  heroLeave(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    ['--px', '--py'].forEach((v) => el.style.setProperty(v, '0'));
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '45%');
    this.mouse.x = this.mouse.y = -9999;
  }

  // "Explore Products" button: glide down to the product strip
  scrollToProducts(e: Event) {
    e.preventDefault();
    document.querySelector('.vs-prod-strip')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => this.startNetwork());
  }

  ngOnDestroy() {
    this.stopNet?.();
  }

  // glowing node network drawn behind the hero text; nodes link up when close and reach for the mouse
  private startNetwork() {
    const canvas = this.netRef?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let visible = true;
    let raf = 0;
    const LINK = 135;
    const REACH = 190;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.8,
      }));
      draw(false);
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const mx = this.mouse.x;
      const my = this.mouse.y;
      for (const n of nodes) {
        if (move) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = w + 10;
          if (n.x > w + 10) n.x = -10;
          if (n.y < -10) n.y = h + 10;
          if (n.y > h + 10) n.y = -10;
          const dx = mx - n.x;
          const dy = my - n.y;
          if (dx * dx + dy * dy < REACH * REACH) {
            n.x += dx * 0.012;
            n.y += dy * 0.012;
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(150,225,220,${((1 - d / LINK) * 0.35).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mx, a.y - my);
        if (dm < REACH) {
          ctx.strokeStyle = `rgba(246,196,83,${((1 - dm / REACH) * 0.75).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible && !document.hidden) draw(true);
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener('resize', resize);
    resize();
    if (!reduce) loop();
    this.stopNet = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }
}