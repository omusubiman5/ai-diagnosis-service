'use client';
import React, { useEffect } from 'react';

export function useGsapAnimations(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let gsap: any;
    let ScrollTrigger: any;
    let hasGSAP = false;
    let hasScrollTrigger = false;

    const init = async () => {
      try {
        gsap = (await import('gsap')).default;
        ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
        gsap.registerPlugin(ScrollTrigger);
        hasGSAP = true;
        hasScrollTrigger = true;
      } catch {
        console.warn('[GSAP] 読み込み失敗。アニメーションなしで表示。');
        return;
      }

      const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        console.log('[GSAP] reduced-motion検出。アニメーション無効化。');
        return;
      }

      // ═══ テキスト分解（SplitText風） ═══
      container.querySelectorAll('.hero-split, .cta-split').forEach((el) => {
        const cls = el.classList.contains('hero-split') ? 'hero-char' : 'cta-wave-char';
        el.innerHTML = (el.textContent || '').split('').map(
          (ch) => `<span class="${cls}">${ch}</span>`
        ).join('');
      });

      // ═══ IntersectionObserver: フェードイン + カウントアップ ═══
      const animObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              animObserver.unobserve(e.target);
              e.target.querySelectorAll('.count-up').forEach((el) => {
                const target = parseInt((el as HTMLElement).dataset.target || '0');
                countUp(el as HTMLElement, target, 1200);
              });
            }
          });
        },
        { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
      );

      container.querySelectorAll(
        '.fade-slide, .chat-container, .story-card, .check-item, #action'
      ).forEach((el) => animObserver.observe(el));

      // ═══ GSAP エモーショナル演出 ═══
      if (hasGSAP && !prefersReducedMotion) {
        // ANIM-04: 吹き出し順次表示（Section 2）
        const chatBubbles = Array.from(container.querySelectorAll('.chat-bubble'));
        chatBubbles.forEach((bubble: any, i: number) => {
          const chatTrigger = container.querySelector('.chat-container');
          gsap.from(bubble, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            delay: 0.3 + i * 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: chatTrigger, start: 'top 80%' },
          });
        });

        // ANIM-12: Before→After遷移（Section 3）
        const storyCards = Array.from(container.querySelectorAll('.story-card'));
        storyCards.forEach((card: any) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: card, start: 'top 75%' },
          });
          const beforeEl = card.querySelector('.story-before');
          const dividerEl = card.querySelector('.story-divider');
          const afterEl = card.querySelector('.story-after');

          if (beforeEl) {
            tl.to(beforeEl, {
              opacity: 0.4,
              filter: 'blur(1px)',
              duration: 0.6,
              delay: 1.0,
            });
          }
          if (dividerEl) {
            tl.from(dividerEl, { scale: 0, opacity: 0, duration: 0.3 });
          }
          if (afterEl) {
            tl.from(afterEl, { opacity: 0, y: 10, duration: 0.6 });
          }
        });

        // ANIM-13: 共感の「間」（Section 1）
        const heroTL = gsap.timeline();
        const line1 = container.querySelector('.hero-line-1');
        const line2 = container.querySelector('.hero-line-2');
        const line3 = container.querySelector('.hero-line-3');
        const line4 = container.querySelector('.hero-line-4');

        if (line1) {
          heroTL.from(line1, { opacity: 0, y: 10, duration: 0.8, delay: 0.3 });
        }
        if (line2) {
          heroTL.from(line2, { opacity: 0, y: 10, duration: 0.6 }, '+=0.3');
        }
        heroTL.addPause('+=1.0');
        if (line3) {
          heroTL.from(line3, { opacity: 0, y: 10, duration: 0.8 });
        }
        heroTL.addPause('+=1.3');
        if (line4) {
          heroTL.from(line4, { opacity: 0, y: 10, duration: 0.6 });
        }

        // ANIM-14: 褒められた温かみ（Section 2 背景）
        const chatContainer = container.querySelector('.chat-container');
        if (chatContainer) {
          gsap.to(chatContainer, {
            backgroundColor: 'rgba(255, 243, 224, 0.4)',
            duration: 0.6,
            delay: 2.3,
            yoyo: true,
            repeat: 1,
            scrollTrigger: { trigger: chatContainer, start: 'top 80%' },
          });
        }

        // ANIM-15: 朝が来た（Section 5 背景変化）
        if (hasScrollTrigger) {
          const actionEl = container.querySelector('#action');
          if (actionEl) {
            ScrollTrigger.create({
              trigger: actionEl,
              start: 'top 80%',
              onEnter: () => {
                gsap.to(actionEl, {
                  background: 'linear-gradient(180deg, #FFF8E1, #FFEFC2)',
                  duration: 1.2,
                  ease: 'power1.out',
                });
              },
            });
          }
        }

        // ═══ 体験カード円状展開（ScrollTrigger + 3D transform）═══
        const experienceCards = container.querySelectorAll('.experience-card');
        const experienceSection = container.querySelector('.experience-section');
        if (experienceCards.length > 0 && experienceSection) {
          gsap.set(experienceCards, { transformPerspective: 800 });
          gsap.from(experienceCards, {
            opacity: 0,
            scale: 0.5,
            rotateY: -90,
            stagger: { each: 0.12, from: 'center' },
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: experienceSection,
              start: 'top 70%',
            },
          });

          ScrollTrigger.create({
            trigger: experienceSection,
            start: 'top 120%',
            onEnter: () => {
              const a = new Audio('/audio/yoshiko-sugoi.mp3');
              a.preload = 'auto';
            },
          });

          ScrollTrigger.create({
            trigger: experienceSection,
            start: 'top 50%',
            onEnter: () => {
              const audio = new Audio('/audio/yoshiko-sugoi.mp3');
              audio.play().catch(() => {});
            },
          });
        }

        // ═══ テキストアニメーション ═══
        const heroChars = Array.from(container.querySelectorAll('.hero-char'));
        heroChars.forEach((ch: any, i: number) => {
          gsap.from(ch, { opacity: 0, y: 5, duration: 0.15, delay: i * 0.04 });
        });

        container.querySelectorAll('.hero-hover-text').forEach((el) => {
          el.addEventListener('mouseenter', () => {
            gsap.to(el, { color: 'var(--c-accent)', duration: 0.3 });
          });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { color: 'var(--c-text)', duration: 0.3 });
          });
        });

        // Section 5: CTA文字が微細に波打つ
        const ctaWaveChars = Array.from(container.querySelectorAll('.cta-wave-char'));
        ctaWaveChars.forEach((ch: any, i: number) => {
          gsap.to(ch, {
            y: -2,
            duration: 0.6,
            delay: i * 0.05,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });

        // 数字カウントアップ後のバウンス
        container.querySelectorAll('.score-number').forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            onEnter: () => {
              const target = parseInt((el as HTMLElement).dataset.target || '0');
              countUp(el as HTMLElement, target, 1200);
              gsap.from(el, { scale: 1.3, duration: 0.4, delay: 1.3, ease: 'back.out(2)' });
            },
          });
        });
      }
    };

    // ═══ 数字カウントアップ（ANIM-11）═══
    function countUp(el: HTMLElement, target: number, duration: number) {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    init();
  }, [containerRef]);
}
