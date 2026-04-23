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
  const satModal = $("#satModal");
  const satPanel = satModal?.querySelector(".satModal__panel") ?? null;
  const satPlayer = $("#satPlayer");
  const satPlayerPanel = satPlayer?.querySelector(".satPlayer__panel") ?? null;
  const satPlayerTitle = $("#satPlayerTitle");
  const satPlayerVideo = satPlayer?.querySelector(".satPlayer__videoEl") ?? null;
  const leadPhoto = $("#leadModalPhoto");
  const leadName = $("#leadModalName");
  const leadRole = $("#leadModalRole");
  const leadAge = $("#leadModalAge");
  const leadBio = $("#leadModalBio");

  let teamLastFocus = null;
  let leadLastFocus = null;

  /** Team-Profile: Bios für Lead-Modal (ca. 100–130 Wörter), Alter in Jahren */
  const LEAD_DATA = {
    ceo: {
      img: "pics/team-ceo.jpg",
      name: "Thomas Halbach",
      role: "Chief Executive Officer (CEO)",
      ageYears: 15,
      bio:
        "Thomas Halbach ist Gründer und Chief Executive Officer von Orbitex. Mit fünfzehn Jahren prägt er das Fundament des Unternehmens und treibt eine klare Vision voran: die Menschheit langfristig und verantwortungsvoll ins All auszuweiten. Er verbindet strategische Weitsicht mit technischer Tiefe — besonders in Softwareentwicklung, Logik, Technik und Physik — und übernimmt die Gesamtleitung von Strategie, Prioritäten und Partnernetzwerken. Thomas sorgt dafür, dass Vision und operative Realität zusammenfinden, gibt Orientierung in komplexen Entscheidungen und stellt Qualität vor Tempo, ohne Fortschritt aus dem Blick zu verlieren.\n\n" +
        "Neben der Arbeit ist er sportlich aktiv und spielt leidenschaftlich Tennis; körperliche Balance und Fokus helfen ihm, auch unter hoher Komplexität klare Entscheidungen zu treffen und das Team motiviert an eine gemeinsame Zielrichtung zu führen.",
    },
    coo: {
      img: "pics/team2.jpg",
      name: "Eric Giehl",
      role: "Co-Chief Executive Officer (Co-CEO)",
      ageYears: 16,
      bio:
        "Eric Giehl ist Co-Chief Executive Officer von Orbitex und verbindet operative Koordination mit strategischem Blick. Mit sechzehn Jahren bringt er Struktur in den Alltag: Er managt Aufgaben, synchronisiert Workstreams und sorgt dafür, dass Teams reibungslos zusammenarbeiten. Eric behält den Überblick über laufende Prozesse, erkennt Engpässe frühzeitig und übersetzt Ziele in konkrete nächste Schritte. Er zeichnet sich durch analytische Stärke, ruhige Entscheidungsfindung und die Fähigkeit aus, viele Informationen gleichzeitig sinnvoll zu gewichten — ein entscheidender Vorteil in einem schnell wachsenden Raumfahrtumfeld.\n\n" +
        "Neben der Arbeit zockt er gerne und denkt in großen Bildern: Er träumt davon, mit Orbitex die Welt nachhaltig zu revolutionieren — mit Pragmatismus, Teamgeist und dem Anspruch, Versprechen auch wirklich einzuhalten.",
    },
    cmo: {
      img: "pics/team3.jpg",
      name: "Jonas Habermehl",
      role: "Chief Marketing Officer (CMO)",
      ageYears: 15,
      bio:
        "Jonas Habermehl ist Chief Marketing Officer von Orbitex. Mit fünfzehn Jahren bringt er Energie in Branding, Kampagnen und Community: Er betreut den Instagram-Kanal, entwickelt kreative Marketing-Strategien und sorgt dafür, dass komplexe Themen verständlich und inspirierend erzählt werden. Jonas besitzt ein feines Gespür für soziale Medien, visuelle Sprache und Timing in der Öffentlichkeitsarbeit. Er verbindet Emotion mit Substanz, damit Orbitex glaubwürdig wächst und gleichzeitig technisch seriös bleibt — eine Balance, die in der Raumfahrtkommunikation entscheidend ist.\n\n" +
        "In der Freizeit spielt er Basketball und zockt gerne; Teamplay und schnelle Reaktion überträgt er nahtlos in die Zusammenarbeit mit dem Team. Orbitex ist für ihn mehr als ein Projekt: eine Mission, die er mit voller Energie sichtbar machen will.",
    },
    cto: {
      img: "pics/team-leon.jpg",
      name: "Leon Kelmendi",
      role: "Chief Technology Officer (CTO)",
      ageYears: 16,
      bio:
        "Leon Kelmendi ist Chief Technology Officer von Orbitex und leitet die technische Entwicklung. Mit sechzehn Jahren bringt er Präzision in Ingenieurfragen, Systemarchitektur und die Koordination der technischen Teams ein. Er ist verantwortlich für die Entwicklungsrichtung unserer Systeme, achtet auf Machbarkeit, Sicherheit und iterative Qualität und bringt seine Stärken in Raketentechnik und Konstruktion ein. Leon treibt Meilensteine mit Ruhe und Detailbewusstsein voran und schafft Klarheit, wenn technische Entscheidungen viele Schnittstellen berühren.\n\n" +
        "Raumfahrt fasziniert ihn seit langem; in der Freizeit betreibt er viel Sport und bringt dieselbe Disziplin in die technische Arbeit ein — mit dem Ziel, Systeme zu bauen, die im echten Betrieb verlässlich funktionieren.",
    },
    cfo: {
      img: "pics/team-jonathan.jpg",
      name: "Jonathan Weinbrecht",
      role: "Chief Financial Officer (CFO)",
      ageYears: 16,
      bio:
        "Jonathan Weinbrecht ist Chief Financial Officer von Orbitex und verantwortet Finanzen, Budget und wirtschaftliche Planung. Mit sechzehn Jahren sorgt er für belastbare Zahlen, transparente Kostenstrukturen und eine solide Basis für Investitionsentscheidungen. Er behält den Überblick über Kosten und Ressourcen, moderiert wirtschaftliche Risiken und arbeitet eng mit dem Leadership-Team zusammen, damit Wachstum finanziell tragfähig bleibt. Jonathan ist zuverlässig, strukturiert und kommuniziert komplexe Finanzthemen so, dass sie für alle Beteiligten handhabbar werden — ohne an Genauigkeit zu verlieren.\n\n" +
        "In seiner Freizeit spielt er gerne Tennis; Fokus und Ausdauer, die er dort trainiert, nutzt er auch im Controlling und bei der langfristigen finanziellen Steuerung von Orbitex.",
    },
  };

  const syncBodyScrollLock = () => {
    const anyOpen = Boolean(
      teamModal?.classList.contains("is-open") ||
        leadModal?.classList.contains("is-open") ||
        satModal?.classList.contains("is-open") ||
        satPlayer?.classList.contains("is-open")
    );
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
    if (open && satModal?.classList.contains("is-open")) setSatModalOpen(false);

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

  const setSatModalOpen = (open) => {
    if (!satModal) return;
    if (open && teamModal?.classList.contains("is-open")) setTeamModalOpen(false);
    if (open && leadModal?.classList.contains("is-open")) setLeadModalOpen(false);
    if (open && satPlayer?.classList.contains("is-open")) setSatPlayerOpen(false);

    satModal.classList.toggle("is-open", open);
    satModal.setAttribute("aria-hidden", String(!open));
    syncBodyScrollLock();

    // Stop looping videos when closed (saves CPU)
    const vids = Array.from(satModal.querySelectorAll("video"));
    if (open) {
      vids.forEach((v) => {
        if (!(v instanceof HTMLVideoElement)) return;
        const rateAttr = v.getAttribute("data-rate");
        const rate = rateAttr ? Number(rateAttr) : 1;
        if (Number.isFinite(rate) && rate > 0) v.playbackRate = rate;
        v.play?.().catch(() => {});
      });
    } else {
      vids.forEach((v) => {
        if (v instanceof HTMLVideoElement) {
          v.pause();
          v.currentTime = 0;
        }
      });
    }

    if (open) {
      satLastFocus = document.activeElement;
      setTimeout(() => satPanel?.focus?.(), 0);
    } else {
      if (satLastFocus && typeof satLastFocus.focus === "function") satLastFocus.focus();
      satLastFocus = null;
    }
  };

  const setSatPlayerOpen = (open, payload = null) => {
    if (!satPlayer || !(satPlayerVideo instanceof HTMLVideoElement)) return;

    satPlayer.classList.toggle("is-open", open);
    satPlayer.setAttribute("aria-hidden", String(!open));
    syncBodyScrollLock();

    if (open) {
      // pause thumbnails while in player
      const vids = Array.from(satModal?.querySelectorAll("video") ?? []);
      vids.forEach((v) => (v instanceof HTMLVideoElement ? v.pause() : null));

      const title = payload?.title ?? "";
      const src = payload?.src ?? "";
      const rate = payload?.rate ?? 1;
      if (satPlayerTitle) satPlayerTitle.textContent = title;
      satPlayerVideo.src = src;
      if (Number.isFinite(rate) && rate > 0) satPlayerVideo.playbackRate = rate;
      satPlayerVideo.play?.().catch(() => {});

      satPlayerLastFocus = document.activeElement;
      setTimeout(() => satPlayerPanel?.focus?.(), 0);
    } else {
      satPlayerVideo.pause();
      satPlayerVideo.removeAttribute("src");
      satPlayerVideo.load();
      if (satPlayerTitle) satPlayerTitle.textContent = "";

      if (satPlayerLastFocus && typeof satPlayerLastFocus.focus === "function") satPlayerLastFocus.focus();
      satPlayerLastFocus = null;
    }
  };

  const openLeadFromId = (id) => {
    const data = LEAD_DATA[id];
    if (!data || !leadPhoto || !leadName || !leadRole || !leadBio) return;

    leadPhoto.src = data.img;
    leadPhoto.alt = `Porträt: ${data.name}`;
    leadName.textContent = data.name;
    leadRole.textContent = data.role;
    if (leadAge) {
      const y = typeof data.ageYears === "number" ? data.ageYears : null;
      leadAge.textContent = y != null ? `${y} Jahre` : "";
    }
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

  // Satellite modal open/close
  let satLastFocus = null;
  let satPlayerLastFocus = null;
  $$("[data-sat-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setNavOpen(false);
      setSatModalOpen(true);
    });
  });

  $$("[data-sat-close]").forEach((el) => {
    el.addEventListener("click", () => setSatModalOpen(false));
  });

  satModal?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains("satModal__backdrop")) setSatModalOpen(false);
  });

  // Card click → open player with the card's own <video><source>
  $$("#satModal .satCard[data-sat-play]").forEach((card) => {
    card.addEventListener("click", (e) => {
      const t = e.target;
      // don't trigger when selecting text
      if (t instanceof HTMLAnchorElement || t instanceof HTMLButtonElement) return;
      const title = card.querySelector(".satCard__name")?.textContent?.trim() ?? "Video";
      const src = card.querySelector("video source")?.getAttribute("src") ?? "";
      const rateAttr = card.querySelector("video")?.getAttribute("data-rate");
      const rate = rateAttr ? Number(rateAttr) : 1;
      if (!src) return;
      setSatPlayerOpen(true, { title, src, rate: Number.isFinite(rate) && rate > 0 ? rate : 1 });
    });
  });

  // Player close handlers
  $$("[data-sat-player-close]").forEach((el) => {
    el.addEventListener("click", () => setSatPlayerOpen(false));
  });

  satPlayer?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains("satPlayer__backdrop")) setSatPlayerOpen(false);
  });

  // Escape: modals first, then mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (satPlayer?.classList.contains("is-open")) {
      setSatPlayerOpen(false);
      return;
    }
    if (satModal?.classList.contains("is-open")) {
      setSatModalOpen(false);
      return;
    }
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
  const heroVideo = $(".hero__video");

  /** Hero-Video langsamer (0.5×) — nach Metadaten erneut setzen, manche Browser setzen beim Start zurück */
  const setHeroVideoPlaybackRate = () => {
    if (!heroVideo || reduceMotion) return;
    try {
      heroVideo.defaultPlaybackRate = 0.5;
      heroVideo.playbackRate = 0.5;
    } catch {
      /* ältere Engines */
    }
  };

  if (heroVideo && typeof heroVideo.pause === "function") {
    if (reduceMotion) {
      heroVideo.pause();
    } else {
      setHeroVideoPlaybackRate();
      heroVideo.addEventListener("loadedmetadata", setHeroVideoPlaybackRate, { once: true });
      heroVideo.addEventListener("ratechange", () => {
        if (heroVideo.playbackRate !== 0.5) setHeroVideoPlaybackRate();
      });
      heroVideo.play?.().then(() => setHeroVideoPlaybackRate()).catch(() => {});
    }
  }

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

  // ------------------------------------------------------------
  // Mission Control: reduced motion + tab visibility (pause animations)
  // ------------------------------------------------------------
  const missionSection = $("#mission-control");
  if (missionSection) {
    const mcSvg = missionSection.querySelector(".missionControl__svg");
    const mcReduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMcSvgSmil = () => {
      if (!mcSvg || typeof mcSvg.pauseAnimations !== "function" || typeof mcSvg.unpauseAnimations !== "function") {
        return;
      }
      const freeze = document.hidden || mcReduceMq.matches;
      if (freeze) mcSvg.pauseAnimations();
      else mcSvg.unpauseAnimations();
    };

    const syncMcReduce = () => {
      missionSection.classList.toggle("missionControl--reduced", mcReduceMq.matches);
      syncMcSvgSmil();
    };
    syncMcReduce();
    mcReduceMq.addEventListener("change", syncMcReduce);

    document.addEventListener("visibilitychange", () => {
      missionSection.classList.toggle("missionControl--paused", document.hidden);
      syncMcSvgSmil();
    });
    syncMcSvgSmil();
  }
})();

