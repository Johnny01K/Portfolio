// MESSAGE ME WIDGET 
const msgWidget = document.querySelector(".message-widget");
const msgBar = document.querySelector(".message-bar");

if (msgWidget && msgBar) {
    msgBar.addEventListener("click", () => {
        msgWidget.classList.toggle("open");
    });
}

// FORMSPREE SUBMIT
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const fsLang = contactForm.querySelector("#fsLang");
  if (fsLang) fsLang.value = (localStorage.getItem("lang") || "en").toLowerCase();

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector(".btn-send");
    const statusEl = contactForm.querySelector(".form-status");
    const originalBtnText = btn.textContent;

    // HELPER FOR i18n MSG
    const t = (key, fallback) => {
      const el = document.querySelector(`[data-i18n="${key}"]`);
      return el ? el.textContent.trim() : (fallback || key);
    };

    btn.disabled = true;
    btn.textContent = t("message_me_sending", "Sending...");
    statusEl.textContent = "";
    statusEl.classList.remove("ok","err");

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        statusEl.textContent = t("message_me_success", "Message received.");
        statusEl.classList.add("ok");
        contactForm.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = Array.isArray(data.errors)
          ? data.errors.map(e => e.message).join(", ")
          : t("message_me_error", "Oops, something went wrong. Please try again.");
        statusEl.textContent = msg;
        statusEl.classList.add("err");
      }
    } catch (err) {
      statusEl.textContent = t("message_me_error", "Oops, something went wrong. Please try again.");
      statusEl.classList.add("err");
    } finally {
      btn.disabled = false;
      btn.textContent = originalBtnText;
    }
  });
}

// SCROLL REVEAL
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18
        }
    );

    revealEls.forEach(el => observer.observe(el));
} else {
    revealEls.forEach(el => el.classList.add("reveal-visible"));
}

// GALLERY CARD ANIMATIONS
// 3D CARD TILT 
const tiltCards = document.querySelectorAll("[data-tilt]");

if (tiltCards.length) {
    const maxRotate = 12;

    tiltCards.forEach(card => {
        const inner = card.querySelector(".gallery-card-inner") || card;

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percentX = (x / rect.width - 0.5) * 2;  // -1 do 1
            const percentY = (y / rect.height - 0.5) * 2;

            const rotateY = percentX * maxRotate;
            const rotateX = -percentY * maxRotate;

            inner.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            inner.style.transform =
                "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

// SCROLL BUTTON
const scrollTopBtn = document.querySelector(".scroll-top-btn");

if (scrollTopBtn) {
    const toggleScrollTopBtn = () => {
        if (window.scrollY > 250) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    };

    window.addEventListener("scroll", toggleScrollTopBtn);
    window.addEventListener("load", toggleScrollTopBtn);

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// IMAGE
const modal = document.getElementById("imageModal");

if (modal) {
    const modalClose = modal.querySelector(".image-modal-close");
    const modalBody = modal.querySelector(".image-modal-body");
    const modalCaption = modal.querySelector(".image-caption");

    const galleryMedia = document.querySelectorAll(
        ".gallery-image-wrapper img, .gallery-image-wrapper video, .certificate-image-wrapper img"
    );

    galleryMedia.forEach((media) => {
        media.addEventListener("click", () => {
            if (!modalBody) return;

            modalBody.innerHTML = "";

            const isVideo = media.tagName.toLowerCase() === "video";
            let node;

            if (isVideo) {
                const video = document.createElement("video");
                video.src = media.currentSrc || media.src;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.className = "image-modal-video";
                node = video;
            } else {
                const img = document.createElement("img");
                img.src = media.src;
                img.alt = media.alt || "";
                img.className = "image-modal-img";
                node = img;
            }

            modalBody.appendChild(node);

            const titleFromFooter =
                media.closest(".gallery-card-inner")
                    ?.querySelector(".gallery-card-title")
                    ?.textContent
                    ?.trim();

            if (modalCaption) {
                modalCaption.textContent =
                    titleFromFooter || media.alt || "Untitled artwork";
            }

            modal.classList.add("open");
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            modal.classList.remove("open");
        }
    });
}

// GALLERY SHORTCUT BUTTONS
const shortcutButtons = document.querySelectorAll(".gallery-shortcut-btn");

if (shortcutButtons.length) {
    const header = document.querySelector(".header");

    shortcutButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetSelector = btn.getAttribute("data-target");
            const target = document.querySelector(targetSelector);
            if (!target) return;

            const headerHeight = header ? header.offsetHeight : 0;
            const rect = target.getBoundingClientRect();
            const offsetTop = window.scrollY + rect.top - headerHeight - 24;

            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        });
    });

    const sectionMap = Array.from(shortcutButtons)
        .map((btn) => {
            const selector = btn.getAttribute("data-target");
            const section = document.querySelector(selector);
            if (!section) return null;
            return { btn, section };
        })
        .filter(Boolean);

    const setActiveShortcut = (sectionId) => {
        sectionMap.forEach(({ btn, section }) => {
            if (section.id === sectionId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    };

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveShortcut(entry.target.id);
                }
            });
        },
        {
            threshold: 0.35,
        }
    );

    sectionMap.forEach(({ section }) => sectionObserver.observe(section));

    const currentSection = sectionMap.find(({ section }) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0;
    });
    if (currentSection) {
        setActiveShortcut(currentSection.section.id);
    } else if (sectionMap[0]) {
        setActiveShortcut(sectionMap[0].section.id);
    }
}

// SUB-HEADER HIDE/SHOW ON SCROLL
const subheader = document.querySelector(".subheader");

if (subheader) {
    let lastScroll = 0;
    const hideThreshold = 150;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll > hideThreshold && currentScroll > lastScroll) {
            subheader.classList.add("subheader-hidden");
        } else if (currentScroll < lastScroll) {
            subheader.classList.remove("subheader-hidden");
        }

        lastScroll = currentScroll;
    });
}

// NAV LINK ACTIVE
const navLinks = document.querySelectorAll(".nav-link");

if (navLinks.length) {
    let currentPage = window.location.pathname.split("/").pop();

    if (!currentPage) currentPage = "index.html";

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// BOOK / FLIP GALLERY PREVIEW 
const bookSlides = document.querySelectorAll(".book-slide");

if (bookSlides.length) {
    const prevBtn = document.querySelector(".book-nav-prev");
    const nextBtn = document.querySelector(".book-nav-next");
    let currentIndex = 0;

    const updateBookSlides = () => {
        const total = bookSlides.length;

        bookSlides.forEach((slide, index) => {
            slide.classList.remove("is-prev", "is-current", "is-next", "is-hidden");

            if (index === currentIndex) {
                slide.classList.add("is-current");
            } else if (index === (currentIndex - 1 + total) % total) {
                slide.classList.add("is-prev");
            } else if (index === (currentIndex + 1) % total) {
                slide.classList.add("is-next");
            } else {
                slide.classList.add("is-hidden");
            }
        });
    };

    const goNext = () => {
        currentIndex = (currentIndex + 1) % bookSlides.length;
        updateBookSlides();
    };

    const goPrev = () => {
        currentIndex = (currentIndex - 1 + bookSlides.length) % bookSlides.length;
        updateBookSlides();
    };

    if (nextBtn) nextBtn.addEventListener("click", goNext);
    if (prevBtn) prevBtn.addEventListener("click", goPrev);

    updateBookSlides();

    let autoFlip = setInterval(() => {
        currentIndex = (currentIndex + 1) % bookSlides.length;
        updateBookSlides();
    }, 3000);

    const bookContainer = document.querySelector(".gallery-book-inner");
    if (bookContainer) {
        bookContainer.addEventListener("mouseenter", () => clearInterval(autoFlip));
        bookContainer.addEventListener("mouseleave", () => {
            autoFlip = setInterval(() => {
                currentIndex = (currentIndex + 1) % bookSlides.length;
                updateBookSlides();
            }, 3000);
        });
    }
}

// MOBILE NAV (hamburger)
const burger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");
const mobileOverlay = document.querySelector(".mobile-overlay");

if (burger && mobileNav && mobileOverlay) {
    const closeMobile = () => {
        document.body.classList.remove("nav-open");
    };

    burger.addEventListener("click", () => {
        document.body.classList.toggle("nav-open");
    });

    mobileOverlay.addEventListener("click", closeMobile);

    mobileNav.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", closeMobile);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 720) closeMobile();
    });
}

// 3D MODELS
const modelViewer = document.getElementById("mainModelViewer");
const modelCards = document.querySelectorAll(".model-card");

if (modelViewer && modelCards.length) {
    modelCards.forEach(card => {
        card.addEventListener("click", () => {
            const src = card.getAttribute("data-model-src");
            if (!src) return;

            modelCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            modelViewer.setAttribute("src", src);
        });
    });
}