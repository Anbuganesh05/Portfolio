'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /* =====================================================
     CUSTOM CURSOR
     ===================================================== */

  const dot = document.getElementById('cursorDot');

  if (dot && !reduceMotion) {

    window.addEventListener('mousemove', (e) => {

      dot.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;

    });

    document.querySelectorAll('a, .tilt-card').forEach((el) => {

      el.addEventListener('mouseenter', () => {
        dot.classList.add('big');
      });

      el.addEventListener('mouseleave', () => {
        dot.classList.remove('big');
      });

    });

  }


  /* =====================================================
     MAGNETIC BUTTONS
     ===================================================== */

  if (!reduceMotion) {

    document.querySelectorAll('[data-magnet]').forEach((wrap) => {

      const el = wrap.querySelector('a');

      if (!el) return;

      wrap.addEventListener('mousemove', (e) => {

        const r = wrap.getBoundingClientRect();

        const x =
          (e.clientX - r.left - r.width / 2) * 0.35;

        const y =
          (e.clientY - r.top - r.height / 2) * 0.35;

        el.style.transform =
          `translate(${x}px, ${y}px)`;

      });

      wrap.addEventListener('mouseleave', () => {

        el.style.transform =
          'translate(0,0)';

      });

    });

  }


  /* =====================================================
     TILT CARDS
     ===================================================== */

  if (!reduceMotion) {

    document.querySelectorAll('[data-tilt]').forEach((card) => {

      card.addEventListener('mousemove', (e) => {

        const r = card.getBoundingClientRect();

        if (!r.width || !r.height) return;

        const px =
          (e.clientX - r.left) / r.width - 0.5;

        const py =
          (e.clientY - r.top) / r.height - 0.5;

        card.style.transform =
          `perspective(600px)
           rotateX(${py * -8}deg)
           rotateY(${px * 8}deg)`;

      });

      card.addEventListener('mouseleave', () => {

        card.style.transform =
          'perspective(600px) rotateX(0) rotateY(0)';

      });

    });

  }


  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  const revealEls =
    document.querySelectorAll('.reveal');


  /*
    The important part:

    Elements are already visible through CSS.
    We only add animation behavior when the browser
    supports IntersectionObserver.
  */

  if (!reduceMotion && 'IntersectionObserver' in window) {

    const io = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add('in');

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold:0.05,
        rootMargin:'0px 0px -20px 0px'
      }
    );


    revealEls.forEach((el) => {
      io.observe(el);
    });


    /*
      Safety fallback:
      If an element somehow remains unrevealed,
      make sure the complete website stays visible.
    */

    setTimeout(() => {

      revealEls.forEach((el) => {

        const rect = el.getBoundingClientRect();

        if (
          rect.top < window.innerHeight &&
          rect.bottom > 0
        ) {
          el.classList.add('in');
        }

      });

    }, 1000);

  } else {

    /*
      No IntersectionObserver or reduced motion:
      show everything immediately.
    */

    revealEls.forEach((el) => {
      el.classList.add('in');
    });

  }


  /* =====================================================
     STORY PROGRESS RAIL
     ===================================================== */

  const sections =
    document.querySelectorAll('[data-section]');

  const rail =
    document.getElementById('rail');


  if (rail && sections.length) {

    sections.forEach(() => {

      const i = document.createElement('i');

      const b = document.createElement('b');

      i.appendChild(b);

      rail.appendChild(i);

    });


    const bars =
      rail.querySelectorAll('b');


    function updateRail() {

      const vh = window.innerHeight;

      sections.forEach((sec, idx) => {

        const bar = bars[idx];

        if (!bar) return;

        const r =
          sec.getBoundingClientRect();

        const total =
          r.height;

        const seen =
          Math.min(
            Math.max(vh * 0.5 - r.top, 0),
            total
          );

        const progress =
          total > 0
            ? seen / total
            : 0;

        bar.style.transform =
          `scaleX(${Math.min(
            Math.max(progress, 0),
            1
          )})`;

      });

    }


    window.addEventListener(
      'scroll',
      updateRail,
      { passive:true }
    );

    window.addEventListener(
      'resize',
      updateRail
    );

    updateRail();

  }

});