/* Orbitex — minimal JS for premium UX (no frameworks).
   Features:
   - Mobile nav toggle
   - Smooth anchor scrolling with fixed-nav offset
   - Fade-in on scroll (IntersectionObserver)
   - Subtle hero parallax (optional, respects reduced motion)
   - Auto year in footer
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const nav = $(".nav");
  const navToggle = $(".nav__toggle");
  const navMobile = $("#navMobile");
  const teamModal = $("#teamModal");
  const teamDialog = teamModal?.querySelector(".modal__dialog") ?? null;
  let lastFocus = null;

  // ------------------------------------------------------------
  // Footer year
  // ------------------------------------------------------------
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ------------------------------------------------------------
  // Mobile nav toggle
  // ------------------------------------------------------------
  const setNavOpen = (open) => {
    if (!nav) return;
    nav.classList.toggle("nav--open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
    if (navMobile) navMobile.setAttribute("aria-hidden", String(!open));
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav?.classList.contains("nav--open") ?? false;
      setNavOpen(!isOpen);
    });
  }

  // Close mobile nav when clicking a link
  $$(".nav__mobile a").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });

  // Close mobile nav on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });

  // ------------------------------------------------------------
  // Team modal (premium popup)
  // ------------------------------------------------------------
  const setModalOpen = (open) => {
    if (!teamModal) return;
    teamModal.classList.toggle("is-open", open);
    teamModal.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      lastFocus = document.activeElement;
      // Focus the dialog for accessibility
      setTimeout(() => teamDialog?.focus?.(), 0);
    } else {
      // Restore focus to opener
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
      lastFocus = null;
    }
  };

  $$('[data-modal-open="team"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      setNavOpen(false);
      setModalOpen(true);
    });
  });

  $$('[data-modal-close="team"]').forEach((btn) => {
    btn.addEventListener("click", () => setModalOpen(false));
  });

  // Close on click outside dialog
  teamModal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains("modal__backdrop")) setModalOpen(false);
  });

  // Close modal on Escape (and keep mobile menu behavior)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && teamModal?.classList.contains("is-open")) setModalOpen(false);
  });

  // ------------------------------------------------------------
  // Smooth anchor scrolling with fixed navbar offset
  // (CSS scroll-behavior already helps; this adds correct offset)
  // ------------------------------------------------------------
  const getNavOffset = () => {
    const h = nav?.getBoundingClientRect().height ?? 0;
    return Math.round(h + 10);
  };

  const scrollToHash = (hash) => {
    if (!hash || hash === "#") return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;

    const top = window.scrollY + target.getBoundingClientRect().top - getNavOffset();
    window.scrollTo({ top, behavior: "smooth" });
  };

  const anchorLinks = $$('a[href^="#"]').filter((a) => a.getAttribute("href")?.length > 1);
  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      // allow default if the anchor is not on this page (rare, but safe)
      if (!href.startsWith("#")) return;

      e.preventDefault();
      scrollToHash(href);
      history.pushState(null, "", href);
    });
  });

  // If user loads page with a hash, adjust for fixed nav
  if (window.location.hash) {
    window.addEventListener("load", () => {
      // small delay to allow layout to settle
      setTimeout(() => scrollToHash(window.location.hash), 50);
    });
  }

  // ------------------------------------------------------------
  // Reveal on scroll (fade-in)
  // ------------------------------------------------------------
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ------------------------------------------------------------
  // Optional hero parallax (subtle)
  // ------------------------------------------------------------
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const heroBg = $(".hero__bg");

  if (!reduceMotion && heroBg) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        // clamp for subtle effect
        const p = Math.max(-18, Math.min(18, y * -0.03));
        heroBg.style.setProperty("--parallax", `${p}px`);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();

