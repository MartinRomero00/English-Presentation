import { Component, signal, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('My Dream Job: Software Developer');

  @ViewChild('presentationRoot', { static: true })
  private presentationRoot!: ElementRef<HTMLElement>;

  public currentSlide = signal(0);
  private slidesLength = 0;
  private scrollHandler = () => {};

  ngAfterViewInit(): void {
    const root = this.presentationRoot.nativeElement;
    const slides = Array.from(root.querySelectorAll('.slide')) as HTMLElement[];
    this.slidesLength = slides.length;

    // update current slide on horizontal scroll (throttled via requestAnimationFrame)
    let raf = 0;
    this.scrollHandler = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = root.clientWidth || window.innerWidth;
        const scrollLeft = root.scrollLeft || 0;
        const idx = Math.round(scrollLeft / width);
        this.currentSlide.set(Math.max(0, Math.min(this.slidesLength - 1, idx)));
      });
    };

    root.addEventListener('scroll', this.scrollHandler, { passive: true });

    // set initial slide index
    this.scrollHandler();
  }

  ngOnDestroy(): void {
    try {
      this.presentationRoot?.nativeElement?.removeEventListener(
        'scroll',
        this.scrollHandler as EventListener
      );
    } catch {}
  }

  public goToSlide(index: number) {
    const root = this.presentationRoot.nativeElement;
    const slides = Array.from(root.querySelectorAll('.slide')) as HTMLElement[];
    const target = slides[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      this.currentSlide.set(index);
    }
  }
}
