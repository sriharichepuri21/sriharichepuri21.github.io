/* ============================================================
   Srihari Chepuri — Portfolio JS
   intro overlay, marquee duplication, reveal on scroll, typing,
   counters, cursor glow, card tilt, dock nav, progress, three.js
   ============================================================ */
"use strict";

/* ---------- intro overlay: hello → name → reveal ---------- */
(() => {
  const intro = document.getElementById("intro");
  if (!intro) return;
  const body = document.body;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { intro.remove(); return; }

  body.classList.add("intro-lock");
  scrollTo(0, 0);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    intro.classList.add("done");
    body.classList.add("intro-finished");
    setTimeout(() => {
      intro.remove();
      body.classList.remove("intro-lock", "intro-finished");
    }, 1100);
  };

  // timeline: hello types in (0.28→~1.1s), holds, morphs to name (2.35s),
  // name holds, curtain sweep (3.55s), then reveal
  const auto = setTimeout(finish, 3900);
  intro.addEventListener("click", () => { clearTimeout(auto); finish(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { clearTimeout(auto); finish(); } }, { once: true });
})();

/* ---------- duplicate marquee tracks for seamless loop ---------- */
(() => {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const items = [...track.children];
    items.forEach((el) => track.appendChild(el.cloneNode(true)));
  });
})();

/* ---------- reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------- typing effect in hero ---------- */
(() => {
  const el = document.getElementById("typed");
  if (!el) return;
  const roles = [
    "Software Engineer",
    "Distributed Systems Builder",
    "Data Platform Engineer",
    "AI-Augmented Developer",
  ];
  let ri = 0, ci = 0, deleting = false;

  const tick = () => {
    const word = roles[ri];
    if (!deleting) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        return setTimeout(tick, 1800);
      }
      return setTimeout(tick, 60 + Math.random() * 50);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        return setTimeout(tick, 350);
      }
      return setTimeout(tick, 32);
    }
  };
  setTimeout(tick, 600);
})();

/* ---------- animated counters ---------- */
(() => {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        io.unobserve(el);
        const target = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".stat-num").forEach((el) => io.observe(el));
})();

/* ---------- cursor glow ---------- */
(() => {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    glow.style.transform = `translate(${x - 170}px, ${y - 170}px)`;
    requestAnimationFrame(loop);
  })();
})();

/* ---------- scroll progress bar ---------- */
(() => {
  const bar = document.querySelector(".scroll-progress span");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- project card tilt ---------- */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce || !fine) return;
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg)`;
      card.style.transition = "transform .06s";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform .45s cubic-bezier(.34,1.4,.64,1), box-shadow .3s, border-color .3s";
    });
  });
})();

/* ---------- dock nav ---------- */
(() => {
  const menuBtn = document.getElementById("dock-menu");
  const topBtn = document.getElementById("dock-top");
  const overlay = document.getElementById("dock-overlay");
  if (!menuBtn || !overlay) return;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!overlay.contains(e.target)) overlay.classList.remove("open");
  });
  overlay.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => overlay.classList.remove("open"))
  );
  topBtn?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ---------- hero interactivity: magnetic buttons + parallax orbs + icon burst ---------- */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce || !fine) return;

  /* magnetic pull on hero ctas + social icons */
  const magnets = document.querySelectorAll(".btn, .socials a");
  magnets.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
      el.style.transition = "transform .05s";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
    });
  });

  /* parallax orbs follow cursor gently */
  const hero = document.querySelector(".hero");
  const orbs = document.querySelectorAll(".hero .orb, .orb-hero-right, .orb-hero-left");
  if (hero && orbs.length) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach((o, i) => {
        const depth = i === 0 ? 26 : -18;
        o.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
        o.style.transition = "transform .6s cubic-bezier(.22,.68,.32,1)";
      });
    });
    hero.addEventListener("mouseleave", () => {
      orbs.forEach((o) => { o.style.transform = ""; });
    });
  }
})();

/* ---------- spotlight cards ---------- */
(() => {
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) return;
  document.querySelectorAll(".spot").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
})();

/* ---------- three.js wireframe torus in hero ---------- */
addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("torus");
  if (!canvas || typeof THREE === "undefined") return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 6;

  const geo = new THREE.TorusGeometry(1.9, 0.62, 14, 44);
  const mat = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.16,
    color: 0xff7a18,
  });
  const torus = new THREE.Mesh(geo, mat);
  scene.add(torus);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener("resize", resize);

  let mx = 0, my = 0;
  addEventListener("mousemove", (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 0.4;
    my = (e.clientY / innerHeight - 0.5) * 0.4;
  });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    torus.rotation.x = t * 0.22 + my;
    torus.rotation.y = t * 0.34 + mx;
    renderer.render(scene, camera);
  })();
});
