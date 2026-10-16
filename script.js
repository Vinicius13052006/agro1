// Configure estes dados antes de publicar o site.
const WHATSAPP_NUMBER = ""; // Exemplo: "5537999999999" (55 + DDD + número, sem espaços)
const INSTAGRAM_URL = "";  // Exemplo: "https://www.instagram.com/perfil_da_loja/"
const FACEBOOK_URL = "";

const makeWhatsAppUrl = (message = "Olá! Gostaria de saber mais sobre a Agro Bela & Bala.") => {
  if (!"5537999028982") return null;
  return `https://wa.me/${"5537999028982"}?text=${encodeURIComponent(message)}`;
};

// Loader: desaparece mesmo se algum recurso externo demorar.
window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector(".loader")?.classList.add("hidden"), 250);
});
window.setTimeout(() => document.querySelector(".loader")?.classList.add("hidden"), 2500);

// Cabeçalho ao rolar a página.
const header = document.getElementById("header");
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 35);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Menu acessível para celular.
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

// Links de WhatsApp: não deixa botões falsos levarem ao topo.
document.querySelectorAll(".whatsapp-link").forEach(link => {
  const message = link.dataset.message || "Olá! Gostaria de saber mais sobre a Agro Bela & Bala.";
  const url = makeWhatsAppUrl(message);
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contato";
    link.removeAttribute("target");
    link.title = "Configure o número do WhatsApp no arquivo script.js";
    link.addEventListener("click", event => {
      event.preventDefault();
      alert("O WhatsApp da loja ainda precisa ser configurado. Adicione o número no arquivo script.js.");
    });
  }
});

// Redes sociais: configure as URLs no começo deste arquivo.
document.querySelectorAll(".socials a[aria-label='Instagram']").forEach(a => { if ("https://www.instagram.com/agrobelaebala?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==") { a.href = "https://www.instagram.com/agrobelaebala?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="; a.target = "_blank"; a.rel = "noopener noreferrer"; } else a.href = "#contato"; });
document.querySelectorAll(".socials a[aria-label='Facebook']").forEach(a => { if (FACEBOOK_URL) { a.href = FACEBOOK_URL; a.target = "_blank"; a.rel = "noopener noreferrer"; } else a.href = "#contato"; });

// Reveal suave ao entrar na tela.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Destaca a seção atual na navegação.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => sectionObserver.observe(section));

// Galeria com ampliação e fechamento por Escape.
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
  });
});
lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeLightbox(); closeMenu(); } });

// Ano do rodapé.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
