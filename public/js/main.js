// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
  themeToggle.checked = currentTheme === "dark";

  themeToggle.addEventListener("change", () => {
    const next = themeToggle.checked ? "dark" : "light";
    htmlElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  if (!themeToggle) return;
  themeToggle.checked = theme === "dark";
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Mobile menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  if (!mobileMenu || !mobileMenuBtn) return;
  mobileMenu.classList.add("hidden");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
}

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    const willOpen = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", !willOpen);
    mobileMenuBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
  });
}

// Form submission (Web3Forms)
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMessage?.classList.remove("show");
    errorMessage?.classList.remove("show");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = "A enviar...";
    }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();

      if (data?.success) {
        successMessage?.classList.add("show");
        form.reset();
        setTimeout(() => successMessage?.classList.remove("show"), 5000);
      } else {
        throw new Error("Submission error");
      }
    } catch {
      errorMessage?.classList.add("show");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || "Enviar Pedido";
      }
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Before/After slider
const ba = document.getElementById("ba");
const baBefore = ba?.querySelector(".ba-before");
const baAfter = ba?.querySelector(".ba-after");
const baHandle = ba?.querySelector(".ba-handle");
const baPrev = document.getElementById("baPrev");
const baNext = document.getElementById("baNext");
const baDots = document.getElementById("baDots");

const BA_SETS = [
  { before: "images/showcase/a1.webp", after: "images/showcase/a2.webp", label: "Exemplo A" },
  { before: "images/showcase/b1.webp", after: "images/showcase/b2.webp", label: "Exemplo B" },
  { before: "images/showcase/c1.webp", after: "images/showcase/c2.webp", label: "Exemplo C" },
  { before: "images/showcase/d1.webp", after: "images/showcase/d2.webp", label: "Exemplo D" },
  { before: "images/showcase/e1.webp", after: "images/showcase/e2.webp", label: "Exemplo E" },
  { before: "images/showcase/f1.webp", after: "images/showcase/f2.webp", label: "Exemplo F" },
  { before: "images/showcase/g1.webp", after: "images/showcase/g2.webp", label: "Exemplo G" },
  { before: "images/showcase/h1.webp", after: "images/showcase/h2.webp", label: "Exemplo H" },
  { before: "images/showcase/i1.webp", after: "images/showcase/i2.webp", label: "Exemplo I" },
  { before: "images/showcase/j1.webp", after: "images/showcase/j2.webp", label: "Exemplo J" },
  { before: "images/showcase/k1.webp", after: "images/showcase/k2.webp", label: "Exemplo K" },
];

let baIndex = 0;
let isDragging = false;

function setClip(percent) {
  if (!baAfter || !baHandle) return;
  baAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
  baHandle.style.left = `${percent}%`;
}

function loadSet(index) {
  if (!baBefore || !baAfter) return;
  baIndex = (index + BA_SETS.length) % BA_SETS.length;
  baBefore.src = BA_SETS[baIndex].before;
  baAfter.src = BA_SETS[baIndex].after;
  setClip(50);

  if (baDots) {
    [...baDots.children].forEach((d, i) => d.classList.toggle("active", i === baIndex));
  }
}

function buildDots() {
  if (!baDots) return;
  baDots.innerHTML = "";
  BA_SETS.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "ba-dot" + (i === baIndex ? " active" : "");
    dot.title = BA_SETS[i].label || `Set ${i + 1}`;
    dot.addEventListener("click", () => loadSet(i));
    baDots.appendChild(dot);
  });
}

function setPosition(x) {
  if (!ba) return;
  const rect = ba.getBoundingClientRect();
  let pos = (x - rect.left) / rect.width;
  pos = Math.max(0.05, Math.min(0.95, pos));
  setClip(pos * 100);
}

if (ba && baBefore && baAfter && baHandle) {
  buildDots();
  loadSet(0);

  ba.style.touchAction = "none";
  ba.style.cursor = "ew-resize";

  const stopDragging = () => {
    isDragging = false;
    document.body.style.userSelect = "";
  };

  ba.addEventListener("pointerdown", (e) => {
    isDragging = true;
    document.body.style.userSelect = "none";
    ba.setPointerCapture(e.pointerId);
    setPosition(e.clientX);
  });

  ba.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  ba.addEventListener("pointerup", stopDragging);
  ba.addEventListener("pointercancel", stopDragging);
  window.addEventListener("pointerup", stopDragging);

  ba.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  baPrev?.addEventListener("click", () => loadSet(baIndex - 1));
  baNext?.addEventListener("click", () => loadSet(baIndex + 1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") loadSet(baIndex - 1);
    if (e.key === "ArrowRight") loadSet(baIndex + 1);
  });
}

