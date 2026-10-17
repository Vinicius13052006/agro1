// Agro Bela & Bala — interações do site
// Configure o WhatsApp e as redes sociais antes de publicar.
const WHATSAPP_NUMBER = "553799603431"; // 55 + DDD + número, sem espaços
const INSTAGRAM_URL = "https://www.instagram.com/agrobelaebala/";
const FACEBOOK_URL = "";

const DEFAULT_MESSAGE = "Olá! Gostaria de saber mais sobre a Agro Bela & Bala.";
const makeWhatsAppUrl = (message = DEFAULT_MESSAGE) => {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// Esconde o loader mesmo se um recurso externo demorar.
const hideLoader = () => document.querySelector(".loader")?.classList.add("hidden");
window.addEventListener("load", () => window.setTimeout(hideLoader, 250), { once: true });
window.setTimeout(hideLoader, 2500);

// Cabeçalho ao rolar.
const header = document.getElementById("header");
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 35);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Menu mobile.
const menuBtn = document.querySelector(".menu-btn");
const navbar = document.querySelector(".navbar");
const closeMenu = () => {
  navbar?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  menuBtn?.setAttribute("aria-label", "Abrir menu");
  if (menuBtn) menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  document.body.classList.remove("menu-open");
};
menuBtn?.addEventListener("click", () => {
  const isOpen = navbar?.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  document.body.classList.toggle("menu-open", Boolean(isOpen));
});
navbar?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth > 850) closeMenu(); });

// Liga todos os links de WhatsApp com mensagens contextuais.
document.querySelectorAll(".whatsapp-link").forEach(link => {
  const url = makeWhatsAppUrl(link.dataset.message || DEFAULT_MESSAGE);
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contato";
    link.removeAttribute("target");
    link.addEventListener("click", event => {
      event.preventDefault();
      alert("Configure o número do WhatsApp no início do arquivo script.js.");
    });
  }
});

// Redes sociais.
document.querySelectorAll(".socials a[aria-label='Instagram']").forEach(a => {
  if (INSTAGRAM_URL) { a.href = INSTAGRAM_URL; a.target = "_blank"; a.rel = "noopener noreferrer"; }
  else a.href = "#contato";
});
document.querySelectorAll(".socials a[aria-label='Facebook']").forEach(a => {
  if (FACEBOOK_URL) { a.href = FACEBOOK_URL; a.target = "_blank"; a.rel = "noopener noreferrer"; }
  else a.href = "#contato";
});
document.querySelectorAll(".socials a[aria-label='WhatsApp']").forEach(a => {
  const url = makeWhatsAppUrl();
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
});

// Banner automático: troca a cada 6 segundos, com setas, bolinhas e pausa ao passar o mouse/focar.
(() => {
  const slider = document.querySelector(".hero-slider");
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  const previous = document.querySelector(".hero-prev");
  const next = document.querySelector(".hero-next");
  if (!slider || slides.length < 2) return;

  const intervalMs = 6000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer = null;
  let paused = reducedMotion;

  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
    slider.classList.remove("is-playing");
    // Reinicia a animação da barra de progresso.
    void slider.offsetWidth;
    if (!paused) slider.classList.add("is-playing");
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    slider.classList.remove("is-playing");
  };
  const start = () => {
    stop();
    if (paused) return;
    slider.classList.add("is-playing");
    timer = window.setInterval(() => show(current + 1), intervalMs);
  };
  const navigate = index => { show(index); start(); };

  previous?.addEventListener("click", () => navigate(current - 1));
  next?.addEventListener("click", () => navigate(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => navigate(i)));
  slider.addEventListener("mouseenter", () => { paused = true; stop(); });
  slider.addEventListener("mouseleave", () => { paused = false; start(); });
  slider.addEventListener("focusin", () => { paused = true; stop(); });
  slider.addEventListener("focusout", event => {
    if (!slider.contains(event.relatedTarget)) { paused = false; start(); }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (!paused) start();
  });
  show(0);
  if (!reducedMotion) start();
})();

// Animações de entrada.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

// Destaca a seção atual na navegação.
if ("IntersectionObserver" in window) {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

// Galeria com ampliação, clique fora e Escape.
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector("img");
const closeLightbox = () => {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};
document.querySelectorAll(".gallery-item").forEach(button => {
  button.addEventListener("click", () => {
    const img = button.querySelector("img");
    if (!img || !lightbox || !lightboxImg) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close")?.focus();
  });
});
lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeLightbox(); closeMenu(); }
});

// Ano automático no rodapé.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
