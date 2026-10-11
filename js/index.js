document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactFormStatus");
  const footerYear = document.getElementById("footerYear");

  if (header) {
    const updateHeader = function () {
      header.classList.toggle("scrolled", window.scrollY > 15);
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  if (menuToggle && mainNav) {
    const navLinks = mainNav.querySelectorAll("a");
    const toggleIcon = menuToggle.querySelector("i");

    function closeMenu() {
      mainNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "فتح القائمة");

      if (toggleIcon) {
        toggleIcon.classList.remove("fa-xmark");
        toggleIcon.classList.add("fa-bars");
      }
    }

    function openMenu() {
      mainNav.classList.add("open");
      document.body.classList.add("menu-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "إغلاق القائمة");

      if (toggleIcon) {
        toggleIcon.classList.remove("fa-bars");
        toggleIcon.classList.add("fa-xmark");
      }
    }

    menuToggle.addEventListener("click", function () {
      if (mainNav.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.forEach(function (item) {
          item.classList.remove("active");
        });

        link.classList.add("active");
        closeMenu();
      });
    });

    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) {
        closeMenu();
      }
    });
  }

  const faqItems = document.querySelectorAll("#faq .faq-item");

  faqItems.forEach(function (item) {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.setAttribute("aria-expanded", "false");
    answer.setAttribute("aria-hidden", "true");

    question.addEventListener("click", function () {
      const isOpen = item.classList.contains("active");

      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove("active");

        const otherQuestion = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");

        if (otherQuestion) {
          otherQuestion.setAttribute("aria-expanded", "false");
        }

        if (otherAnswer) {
          otherAnswer.setAttribute("aria-hidden", "true");
        }
      });

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.setAttribute("aria-hidden", "false");
      }
    });
  });

  if (form && status) {
    const fields = [
      {
        element: document.getElementById("contactName"),
        message: "يرجى إدخال الاسم بشكل صحيح.",
        validate: function (value) {
          return value.trim().length >= 2;
        }
      },
      {
        element: document.getElementById("contactPhone"),
        message: "يرجى إدخال رقم هاتف صحيح.",
        validate: function (value) {
          return /^[+]?[\d\s()-]{8,20}$/.test(value.trim());
        }
      },
      {
        element: document.getElementById("contactService"),
        message: "يرجى اختيار الخدمة المطلوبة.",
        validate: function (value) {
          return value.trim() !== "";
        }
      },
      {
        element: document.getElementById("contactCity"),
        message: "يرجى إدخال المدينة.",
        validate: function (value) {
          return value.trim().length >= 2;
        }
      },
      {
        element: document.getElementById("contactMessage"),
        message: "يرجى كتابة تفاصيل الطلب (10 أحرف على الأقل).",
        validate: function (value) {
          return value.trim().length >= 10;
        }
      }
    ].filter(function (field) {
      return field.element && form.contains(field.element);
    });

    function validateField(field) {
      const input = field.element;
      const wrapper = input.closest(".col-12, .col-md-6");
      const error = wrapper
        ? wrapper.querySelector(".contact-error")
        : null;

      const valid = field.validate(input.value);

      input.classList.toggle("is-invalid", !valid);
      input.classList.toggle("is-valid", valid);
      input.setAttribute("aria-invalid", String(!valid));

      if (error) {
        error.textContent = valid ? "" : field.message;
      }

      return valid;
    }

    function clearStatus() {
      status.className = "contact-form-status";
      status.textContent = "";
    }

    fields.forEach(function (field) {
      ["input", "change"].forEach(function (eventName) {
        field.element.addEventListener(eventName, function () {
          validateField(field);
          clearStatus();
        });
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus();

      let firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) {
          firstInvalid = field.element;
        }
      });

      if (firstInvalid) {
        status.textContent =
          "يرجى مراجعة البيانات المطلوبة قبل المتابعة.";
        status.classList.add("show", "error");
        firstInvalid.focus();
        return;
      }

      const getValue = function (id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
      };

      const name = getValue("contactName");
      const phone = getValue("contactPhone");
      const service = getValue("contactService");
      const city = getValue("contactCity");
      const message = getValue("contactMessage");

      const whatsappNumber = "966594720015";

      const whatsappMessage = [
        "مرحبًا، أرغب في الاستفسار عن خدماتكم.",
        "",
        "الاسم: " + name,
        "رقم الهاتف: " + phone,
        "الخدمة المطلوبة: " + service,
        "المدينة: " + city,
        "تفاصيل الطلب: " + message
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(whatsappMessage);

      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      if (!whatsappWindow) {
        status.textContent =
          "تعذر فتح واتساب. يرجى السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.";
        status.classList.add("show", "error");
        return;
      }

      form.reset();

      fields.forEach(function (field) {
        field.element.classList.remove("is-valid", "is-invalid");
        field.element.removeAttribute("aria-invalid");

        const wrapper = field.element.closest(".col-12, .col-md-6");
        const error = wrapper
          ? wrapper.querySelector(".contact-error")
          : null;

        if (error) {
          error.textContent = "";
        }
      });

      clearStatus();
    });
  }

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
  const lightbox = document.getElementById("portfolioLightbox");

if (lightbox) {
    const lightboxContent = lightbox.querySelector(".portfolio-lightbox-content");
    const closeButton = lightbox.querySelector(".portfolio-lightbox-close");
    const prevButton = lightbox.querySelector(".portfolio-lightbox-prev");
    const nextButton = lightbox.querySelector(".portfolio-lightbox-next");
    const mediaItems = Array.from(document.querySelectorAll(".portfolio-media"));

    let currentIndex = 0;
    let visibleItems = [];

    function getVisibleItems() {
        return mediaItems.filter(function (item) {
            return item.closest(".portfolio-item") &&
                !item.closest(".portfolio-item").hidden;
        });
    }

    function showMedia(index) {
        visibleItems = getVisibleItems();

        if (!visibleItems.length || !lightboxContent) return;

        currentIndex = (index + visibleItems.length) % visibleItems.length;

        const item = visibleItems[currentIndex];
        const src = item.dataset.src;
        const type = item.dataset.type;

        if (!src) return;

        lightboxContent.replaceChildren();

        if (type === "video") {
            const video = document.createElement("video");
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.className = "portfolio-lightbox-video";
            lightboxContent.appendChild(video);
        } else {
            const image = document.createElement("img");
            image.src = src;
            image.alt = item.getAttribute("aria-label") || "صورة من معرض الأعمال";
            image.className = "portfolio-lightbox-image";
            lightboxContent.appendChild(image);
        }

        prevButton?.classList.toggle("d-none", visibleItems.length < 2);
        nextButton?.classList.toggle("d-none", visibleItems.length < 2);
    }

    function openLightbox(index) {
        showMedia(index);

        if (!visibleItems.length) return;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("portfolio-lightbox-open");
        closeButton?.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("portfolio-lightbox-open");

        const video = lightboxContent?.querySelector("video");

        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }

        lightboxContent?.replaceChildren();
    }

    mediaItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const items = getVisibleItems();
            const index = items.indexOf(item);

            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    prevButton?.addEventListener("click", function () {
        showMedia(currentIndex - 1);
    });

    nextButton?.addEventListener("click", function () {
        showMedia(currentIndex + 1);
    });

    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showMedia(currentIndex + 1);
        } else if (event.key === "ArrowRight") {
            showMedia(currentIndex - 1);
        }
    });
}
});