/* ==========================================================================
   SETUP
   ========================================================================== */
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNarrow = window.matchMedia("(max-width: 900px)").matches;

if (!isTouch) document.documentElement.classList.add("has-cursor");

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   LOADING VEIL
   ========================================================================== */
window.addEventListener("load", () => {
  const veil = document.getElementById("loading-screen");
  document.body.classList.remove("loading");
  setTimeout(() => veil.classList.add("hidden"), 150);
});
setTimeout(() => {
  const veil = document.getElementById("loading-screen");
  if (veil && !veil.classList.contains("hidden")) {
    document.body.classList.remove("loading");
    veil.classList.add("hidden");
  }
}, 6000);

/* ==========================================================================
   LENIS SMOOTH SCROLL
   ========================================================================== */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
if (!isTouch) {
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorLabel");
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("is-active");
      label.textContent = el.getAttribute("data-cursor") || "";
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-active");
      label.textContent = "";
    });
  });
}

/* ==========================================================================
   HERO — mouse parallax on the four landscape layers
   ========================================================================== */
const heroParallax = document.getElementById("heroParallax");
if (heroParallax && !isTouch && !prefersReducedMotion) {
  const layers = heroParallax.querySelectorAll(".layer");
  const strength = [6, 12, 18, 26];
  window.addEventListener("mousemove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    layers.forEach((layer, i) => {
      gsap.to(layer, {
        x: nx * strength[i],
        y: ny * strength[i],
        duration: 1.2,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  });
}

/* Scroll-driven parallax as a fallback / additive depth on all devices */
gsap.utils.toArray(".hero-parallax .layer").forEach((layer, i) => {
  gsap.to(layer, {
    yPercent: 10 + i * 6,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
});

/* ==========================================================================
   TYPING SUBTITLE
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typing-text");
  if (!el) return;
  const phrases = ["Building things that work.", "Building things that feel like something."];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const current = phrases[pi];
    el.textContent = current.substring(0, ci) + (ci < current.length || deleting ? "|" : "");
    if (!deleting) {
      ci++;
      if (ci > current.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      ci--;
      if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }
  tick();
});

/* ==========================================================================
   PROJECTS — pinned horizontal rail on desktop, natural flow on mobile
   ========================================================================== */
const rail = document.getElementById("projectsRail");
const railWrap = document.getElementById("projectsRailWrap");

if (rail && railWrap) {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const setDistance = () => rail.scrollWidth - window.innerWidth + window.innerWidth * 0.08;

    const tween = gsap.to(rail, {
      x: () => -setDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: railWrap,
        start: "top top",
        end: () => "+=" + setDistance(),
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => tween.kill();
  });

  // Panel image reveal (both breakpoints)
  gsap.utils.toArray(".panel").forEach((panel) => {
    gsap.fromTo(
      panel.querySelector(".panel-media"),
      { opacity: 0.3, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: panel,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

/* ==========================================================================
   WORK — chapter reveal
   ========================================================================== */
gsap.utils.toArray(".chapter").forEach((chapter, i) => {
  gsap.fromTo(
    chapter,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: chapter, start: "top 82%", toggleActions: "play none none reverse" },
    }
  );
});

/* ==========================================================================
   ABOUT — copy + tag reveal
   ========================================================================== */
gsap.fromTo(
  ".about-photo",
  { opacity: 0, y: 40 },
  {
    opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
    scrollTrigger: { trigger: ".about-grid", start: "top 80%" },
  }
);
gsap.fromTo(
  ".about-copy p",
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out",
    scrollTrigger: { trigger: ".about-copy", start: "top 80%" },
  }
);
gsap.fromTo(
  ".about-tags li",
  { opacity: 0, y: 10 },
  {
    opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out",
    scrollTrigger: { trigger: ".about-tags", start: "top 90%" },
  }
);

/* ==========================================================================
   FATHOM GAUGE — scroll progress + active section + click-to-scroll
   ========================================================================== */
const fathomFill = document.getElementById("fathomFill");
const fathomStops = document.querySelectorAll(".fathom-stop");
const sections = ["hero", "projects", "work", "about"].map((id) => document.getElementById(id));

function updateFathom() {
  const doc = document.documentElement;
  const total = doc.scrollHeight - window.innerHeight;
  const y = window.scrollY || doc.scrollTop;
  const pct = total > 0 ? Math.min(100, Math.max(0, (y / total) * 100)) : 0;
  if (fathomFill) fathomFill.style.height = pct + "%";

  let activeIndex = 0;
  sections.forEach((sec, i) => {
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.5) activeIndex = i;
  });
  fathomStops.forEach((stop, i) => stop.classList.toggle("active", i === activeIndex));
}

window.addEventListener("scroll", updateFathom, { passive: true });
if (lenis) lenis.on("scroll", updateFathom);
updateFathom();

fathomStops.forEach((stop) => {
  stop.addEventListener("click", () => {
    const target = document.getElementById(stop.getAttribute("data-target"));
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ==========================================================================
   NAV LINK SMOOTH SCROLL (hero pills)
   ========================================================================== */
document.querySelectorAll("a.nav-link").forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

/* Refresh ScrollTrigger after fonts/images settle so pin distances are accurate */
window.addEventListener("load", () => ScrollTrigger.refresh());
