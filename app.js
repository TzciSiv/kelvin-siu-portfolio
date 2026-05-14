const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const navSections = navLinks
  .filter((link) => link.dataset.section)
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean)
  .sort((first, second) => first.offsetTop - second.offsetTop);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

let ticking = false;

function setActiveNav(activeKey) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.section === activeKey || link.dataset.page === activeKey;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveSection() {
  if (currentPage === "projects.html") {
    setActiveNav("projects");
    return;
  }

  const activationLine = window.scrollY + window.innerHeight * 0.35;
  let currentSection = null;

  navSections.forEach((section) => {
    if (section.offsetTop <= activationLine) {
      currentSection = section.id;
    }
  });

  setActiveNav(currentSection);
}

function updateScrollDepth() {
  const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / maxScroll, 1);

  // Keep the parallax gentle so it feels alive without fighting the resume text.
  if (!prefersReducedMotion.matches) {
    root.style.setProperty("--scroll-depth", `${Math.round(progress * 110)}px`);
  }

  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateActiveSection();
  ticking = false;
}

function requestDepthUpdate() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(updateScrollDepth);
}

updateScrollDepth();
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveNav(link.dataset.section || link.dataset.page);
  });
});
window.addEventListener("scroll", requestDepthUpdate, { passive: true });
window.addEventListener("resize", requestDepthUpdate);
