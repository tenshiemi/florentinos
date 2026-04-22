import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScroll(): Lenis {
  const lenis = new Lenis();

  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', () => ScrollTrigger.update());

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function initAnimations(): void {
  // Fade up: any element with data-animate="fade-up"
  gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // Stagger children: parent with data-animate="stagger"
  gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((parent) => {
    gsap.from(parent.children, {
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    });
  });
}
