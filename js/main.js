// Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener("click", function () {
  const current = htmlElement.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
}

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Form submission (Web3Forms)
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async function (e) {
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
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      if (data?.success) {
        successMessage?.classList.add("show");
        form.reset();

        setTimeout(() => {
          successMessage?.classList.remove("show");
        }, 5000);
      } else {
        throw new Error("Submission error");
      }
    } catch {
      errorMessage?.classList.add("show");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          submitButton.dataset.originalText || "Enviar Pedido";
      }
    }
  });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ================================
// Slider Antes/Depois com conjuntos
// ================================
const ba = document.getElementById("ba");
const baBefore = ba?.querySelector(".ba-before");
const baAfter = ba?.querySelector(".ba-after");
const baHandle = ba?.querySelector(".ba-handle");

const baPrev = document.getElementById("baPrev");
const baNext = document.getElementById("baNext");
const baDots = document.getElementById("baDots");

// Define aqui os teus conjuntos
const BA_SETS = [
  {
    before: "images/showcase/a1.webp",
    after: "images/showcase/a2.webp",
    label: "Exemplo A",
  },
  {
    before: "images/showcase/B1.webp",
    after: "images/showcase/B2.webp",
    label: "Exemplo B",
  },
  {
    before: "images/showcase/C1.webp",
    after: "images/showcase/C2.webp",
    label: "Exemplo C",
  },
  {
    before: "images/showcase/D1.webp",
    after: "images/showcase/D2.webp",
    label: "Exemplo D",
  },
  {
    before: "images/showcase/E1.webp",
    after: "images/showcase/E2.webp",
    label: "Exemplo E",
  },
  {
    before: "images/showcase/F1.webp",
    after: "images/showcase/F2.webp",
    label: "Exemplo F",
  },
  {
    before: "images/showcase/G1.webp",
    after: "images/showcase/G2.webp",
    label: "Exemplo G",
  },
  {
    before: "images/showcase/H1.webp",
    after: "images/showcase/H2.webp",
    label: "Exemplo H",
  },
  {
    before: "images/showcase/i1.webp",
    after: "images/showcase/i2.webp",
    label: "Exemplo I",
  },
  {
    before: "images/showcase/J1.webp",
    after: "images/showcase/J2.webp",
    label: "Exemplo J",
  },
  {
    before: "images/showcase/K1.webp",
    after: "images/showcase/K2.webp",
    label: "Exemplo K",
  },
];

let baIndex = 0;
let isDragging = false;

function setClip(percent) {
  baAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
  baHandle.style.left = `${percent}%`;
}

function loadSet(index) {
  baIndex = (index + BA_SETS.length) % BA_SETS.length;

  // troca imagens
  baBefore.src = BA_SETS[baIndex].before;
  baAfter.src = BA_SETS[baIndex].after;

  // reset do slider para o meio
  setClip(50);

  // dots active
  if (baDots) {
    [...baDots.children].forEach((d, i) =>
      d.classList.toggle("active", i === baIndex),
    );
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
  const rect = ba.getBoundingClientRect();
  let pos = (x - rect.left) / rect.width;
  pos = Math.max(0.05, Math.min(0.95, pos));
  setClip(pos * 100);
}

if (ba && baBefore && baAfter && baHandle) {
  buildDots();
  loadSet(0);

  // Drag mouse
  ba.addEventListener("mousedown", (e) => {
    isDragging = true;
    setPosition(e.clientX);
  });
  window.addEventListener("mouseup", () => (isDragging = false));
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setPosition(e.clientX);
  });

  // Touch
  ba.addEventListener("touchstart", (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  });
  window.addEventListener("touchend", () => (isDragging = false));
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    setPosition(e.touches[0].clientX);
  });

  // Navegação
  baPrev?.addEventListener("click", () => loadSet(baIndex - 1));
  baNext?.addEventListener("click", () => loadSet(baIndex + 1));

  // Teclado (opcional)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") loadSet(baIndex - 1);
    if (e.key === "ArrowRight") loadSet(baIndex + 1);
  });
}
