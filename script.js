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
  const leadModal = $("#leadModal");
  const leadPanel = leadModal?.querySelector(".leadModal__panel") ?? null;
  const leadPhoto = $("#leadModalPhoto");
  const leadName = $("#leadModalName");
  const leadRole = $("#leadModalRole");
  const leadBio = $("#leadModalBio");

  let teamLastFocus = null;
  let leadLastFocus = null;

  /** Lange Bios — später durch finale Texte ersetzen */
  const LEAD_DATA = {
    ceo: {
      img: "pics/team-ceo.jpg",
      name: "Halbach Thomas",
      role: "Chief Executive Officer (CEO)",
      bio:
        "Halbach Thomas verantwortet die Gesamtstrategie von Orbitex: Mission Design, internationale Partnerschaften und die Skalierung der Startinfrastruktur. Mit einem klaren Fokus auf Zuverlässigkeit und europäische Souveränität bündelt er Unternehmensführung, Governance und langfristige Programmplanung. Seine Priorität ist eine Organisation, die komplexe Raumfahrtprojekte mit industrieller Disziplin umsetzt — ohne Kompromisse bei Sicherheit und Qualität.\n\n" +
        "Verantwortung: Unternehmensstrategie, Board-Kommunikation, strategische Allianzen, Risiko- und Portfolioführung.\n\n" +
        "Vision: Orbitex als europäische Referenz für häufige, sichere und nachhaltige Zugänge zum Orbit etablieren — von der ersten Mission bis zur wiederholbaren Betriebsführung.",
    },
    coo: {
      img: "pics/team2.jpg",
      name: "Giehl Eric",
      role: "Co-Chief Executive Officer (Co-CEO)",
      bio:
        "Giehl Eric steht für operative Exzellenz und skalierbare Abläufe. Er verbindet Engineering-Kultur mit unternehmerischer Geschwindigkeit und sorgt dafür, dass Entscheidungen schnell, messbar und nachvollziehbar in die Umsetzung gehen. Sein Schwerpunkt liegt auf Programmsteuerung, Lieferketten und der nahtlosen Zusammenarbeit zwischen Standorten und Partnern.\n\n" +
        "Verantwortung: operative Programmführung, Skalierung der Startorganisation, Schnittstellenmanagement zu Schlüsselpartnern.\n\n" +
        "Vision: Orbitex als Team zu führen, das komplexe Raumfahrtprogramme mit der Präzision eines Tech-Unternehmens und der Seriosität eines Luftfahrtkonzerns liefert.",
    },
    cmo: {
      img: "pics/team3.jpg",
      name: "Habermehl Jonas",
      role: "Chief Marketing Officer (CMO)",
      bio:
        "Habermehl Jonas positioniert Orbitex am Markt: klare Markenidentität, internationale Sichtbarkeit und verständliche Kommunikation von Technologie und Mission. Er übersetzt komplexe Inhalte in starke Narrative und baut Ökosysteme aus Medien, Community und Partnern auf.\n\n" +
        "Verantwortung: Markenführung, Kommunikation, Growth, Events &amp; digitale Präsenz.\n\n" +
        "Vision: Orbitex als Marke wahrnehmbar machen, die Vertrauen schafft — technisch glaubwürdig, emotional inspirierend und klar europäisch.",
    },
    cto: {
      img: "pics/team-leon.jpg",
      name: "Kelmendi Leon",
      role: "Chief Engineering Officer (CTO)",
      bio:
        "Kelmendi Leon führt die technische Gesamtarchitektur: Systemengineering, Avionik, Software, Strukturen und Integration. Er sorgt für eine konsistente Technologiestrategie von der Simulation bis zum Start und setzt auf nachvollziehbare Standards, Reviews und Qualitätssicherung in jeder Phase.\n\n" +
        "Verantwortung: Engineering-Exzellenz, technische Roadmap, Systemintegration, Sicherheitskultur im Entwicklungsprozess.\n\n" +
        "Vision: Orbitex als Engineering-Referenz — schnell iterierend, aber niemals leichtfertig; Innovation mit messbarer Zuverlässigkeit.",
    },
    cfo: {
      img: "pics/Jonathan.jpg",
      name: "Weinbrecht Jonathan",
      role: "Chief Financial Officer (CFO)",
      bio:
        "Weinbrecht Jonathan steuert Finanzen, Controlling und Investorenkommunikation. Er sorgt für transparente Planung, belastbare Forecasts und eine Kapitalstruktur, die ambitionierte Raumfahrtprogramme tragfähig macht — von der ersten Entwicklungsphase bis zur Betriebsskalierung.\n\n" +
        "Verantwortung: Finanzstrategie, Budgetierung, Reporting, Fundraising &amp; Investor Relations.\n\n" +
        "Vision: Finanzielle Resilienz als strategischer Vorteil — damit Orbitex Wachstum und Innovation gleichzeitig verantwortungsvoll beschleunigen kann.",
    },
  };

  const syncBodyScrollLock = () => {
    const anyOpen = Boolean(teamModal?.classList.contains("is-open") || leadModal?.classList.contains("is-open"));
    document.body.style.overflow = anyOpen ? "hidden" : "";
  };

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

  // ------------------------------------------------------------
  // Team modal (Navbar „Team“)
  // ------------------------------------------------------------
  const setTeamModalOpen = (open) => {
    if (!teamModal) return;
    if (open && leadModal?.classList.contains("is-open")) setLeadModalOpen(false);

    teamModal.classList.toggle("is-open", open);
    teamModal.setAttribute("aria-hidden", String(!open));
    syncBodyScrollLock();

    if (open) {
      teamLastFocus = document.activeElement;
      setTimeout(() => teamDialog?.focus?.(), 0);
    } else {
      if (teamLastFocus && typeof teamLastFocus.focus === "function") teamLastFocus.focus();
      teamLastFocus = null;
    }
  };

  const setLeadModalOpen = (open) => {
    if (!leadModal) return;
    if (open && teamModal?.classList.contains("is-open")) setTeamModalOpen(false);

    leadModal.classList.toggle("is-open", open);
    leadModal.setAttribute("aria-hidden", String(!open));
    syncBodyScrollLock();

    if (open) {
      leadLastFocus = document.activeElement;
      setTimeout(() => leadPanel?.focus?.(), 0);
    } else {
      if (leadLastFocus && typeof leadLastFocus.focus === "function") leadLastFocus.focus();
      leadLastFocus = null;
    }
  };

  const openLeadFromId = (id) => {
    const data = LEAD_DATA[id];
    if (!data || !leadPhoto || !leadName || !leadRole || !leadBio) return;

    leadPhoto.src = data.img;
    leadPhoto.alt = `Porträt: ${data.name}`;
    leadName.textContent = data.name;
    leadRole.textContent = data.role;
    leadBio.innerHTML = data.bio
      .split(/\n\n/)
      .map((chunk) => `<p>${chunk.replace(/\n/g, "<br />")}</p>`)
      .join("");

    setLeadModalOpen(true);
  };

  $$('[data-modal-open="team"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      setNavOpen(false);
      setTeamModalOpen(true);
    });
  });

  $$('[data-modal-close="team"]').forEach((btn) => {
    btn.addEventListener("click", () => setTeamModalOpen(false));
  });

  // Close on click outside dialog
  teamModal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains("modal__backdrop")) setTeamModalOpen(false);
  });

  // Team-Modal: Person antippen → Detail-Modal (Leadership)
  teamModal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const pick = target.closest("[data-pick-lead]");
    if (!pick) return;
    const id = pick.getAttribute("data-pick-lead");
    if (!id) return;
    setTeamModalOpen(false);
    openLeadFromId(id);
  });

  // Leadership modal open/close
  $$("[data-lead-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-lead-id");
      if (!id) return;
      setNavOpen(false);
      openLeadFromId(id);
    });
  });

  $$("[data-lead-close]").forEach((el) => {
    el.addEventListener("click", () => setLeadModalOpen(false));
  });

  leadModal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains("leadModal__backdrop")) setLeadModalOpen(false);
  });

  // Escape: modals first, then mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (leadModal?.classList.contains("is-open")) {
      setLeadModalOpen(false);
      return;
    }
    if (teamModal?.classList.contains("is-open")) {
      setTeamModalOpen(false);
      return;
    }
    setNavOpen(false);
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

