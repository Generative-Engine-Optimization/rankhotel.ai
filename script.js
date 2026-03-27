/**
 * Tailwind CDN theme — load this file immediately after the Tailwind CDN script.
 * Colors reference CSS variables defined in style.css (:root).
 */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-fixed": "var(--color-primary-fixed)",
        primary: "var(--color-primary)",
        outline: "var(--color-outline)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "on-error-container": "var(--color-on-error-container)",
        "surface-tint": "var(--color-surface-tint)",
        "surface-variant": "var(--color-surface-variant)",
        "surface-container-low": "var(--color-surface-container-low)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        background: "var(--color-background)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        tertiary: "var(--color-tertiary)",
        "on-secondary": "var(--color-on-secondary)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "tertiary-container": "var(--color-tertiary-container)",
        "error-container": "var(--color-error-container)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        error: "var(--color-error)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "on-surface": "var(--color-on-surface)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "on-background": "var(--color-on-background)",
        surface: "var(--color-surface)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "on-primary": "var(--color-on-primary)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "surface-dim": "var(--color-surface-dim)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "on-error": "var(--color-on-error)",
        "surface-bright": "var(--color-surface-bright)",
        "on-tertiary": "var(--color-on-tertiary)",
        "inverse-primary": "var(--color-inverse-primary)",
        "surface-container": "var(--color-surface-container)",
        "inverse-surface": "var(--color-inverse-surface)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        secondary: "var(--color-secondary)",
        "on-primary-container": "var(--color-on-primary-container)",
        "outline-variant": "var(--color-outline-variant)",
      },
      fontFamily: {
        headline: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
};

(function () {
  "use strict";

  const mqDesktop = window.matchMedia("(min-width: 768px)");
  const mqBlogTocWide = window.matchMedia("(min-width: 1024px)");

  function pageLang() {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return lang.startsWith("it") ? "it" : "en";
  }

  function navLabels() {
    return pageLang() === "it"
      ? { open: "Apri menu di navigazione", close: "Chiudi menu di navigazione" }
      : { open: "Open navigation menu", close: "Close navigation menu" };
  }

  function closeMenu(toggle, panel) {
    if (!toggle || !panel) return;
    const labels = navLabels();
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-label", labels.open);
  }

  function openMenu(toggle, panel) {
    if (!toggle || !panel) return;
    const labels = navLabels();
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    toggle.setAttribute("aria-label", labels.close);
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const panel = document.getElementById("primary-menu");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu(toggle, panel);
      } else {
        openMenu(toggle, panel);
      }
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!mqDesktop.matches) {
          closeMenu(toggle, panel);
        }
      });
    });

    function onResize() {
      if (mqDesktop.matches) {
        closeMenu(toggle, panel);
      }
    }

    mqDesktop.addEventListener("change", onResize);
    window.addEventListener("resize", onResize);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(toggle, panel);
        toggle.focus();
      }
    });

    toggle.setAttribute("aria-label", navLabels().open);
  }

  /** Audit form → Make.com webhook (URL da `data-webhook` sul form, o window.RANKHOTEL_MAKE_WEBHOOK). */
  function getAuditWebhookUrl(form) {
    const fromWin =
      typeof window !== "undefined" && window.RANKHOTEL_MAKE_WEBHOOK
        ? String(window.RANKHOTEL_MAKE_WEBHOOK).trim()
        : "";
    const fromForm = (form.getAttribute("data-webhook") || "").trim();
    return fromWin || fromForm;
  }

  function webhookErrorMessage(status, lang) {
    const en = lang === "en";
    if (status === 410 || status === 404) {
      if (en) {
        return (
          "Make webhook no longer active (error " +
          status +
          "). In Make.com open the scenario, ensure it is on, add or renew the «Custom webhook» module, copy the new URL and replace it in the form's data-webhook attribute."
        );
      }
      return (
        "Webhook Make non più attivo (errore " +
        status +
        "). In Make.com apri lo scenario, assicurati che sia acceso, aggiungi o rinnova il modulo «Webhook personalizzato», copia il nuovo indirizzo e sostituiscilo nell'attributo data-webhook del form."
      );
    }
    if (status === 403 || status === 401) {
      if (en) {
        return "Webhook access denied. Check in Make for any API keys or restrictions on the Webhook module.";
      }
      return "Accesso al webhook rifiutato. Controlla in Make eventuali chiavi API o restrizioni sul modulo Webhook.";
    }
    if (en) {
      return (
        "Submission failed (server error " + status + "). Try again shortly or verify the Make scenario."
      );
    }
    return "Invio non riuscito (errore server " + status + "). Riprova tra poco o verifica lo scenario Make.";
  }

  function formStrings(lang) {
    if (lang === "en") {
      return {
        submitting: "Sending…",
        success: "Request sent. We'll get back to you soon.",
        webhookMissing:
          "Webhook URL missing: set data-webhook on the form or window.RANKHOTEL_MAKE_WEBHOOK.",
        networkError:
          "Connection blocked or offline. If you opened the site from file://, try an HTTP server; if the console shows a CORS error, enable cross-origin requests on the webhook in Make or use a proxy.",
        genericError: "Submission failed. Please try again shortly.",
      };
    }
    return {
      submitting: "Invio in corso…",
      success: "Richiesta inviata. Ti contatteremo al più presto.",
      webhookMissing:
        "Manca l'URL del webhook: imposta data-webhook sul form oppure window.RANKHOTEL_MAKE_WEBHOOK.",
      networkError:
        "Connessione bloccata o rete assente. Se usi il sito da file:// prova da un server HTTP; se in console compare un errore CORS, abilita le richieste cross-origin sul webhook in Make o usa un proxy.",
      genericError: "Invio non riuscito. Riprova tra poco.",
    };
  }

  function setAuditFormStatus(el, message, kind) {
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
    el.classList.remove("text-tertiary", "text-error", "text-on-surface-variant");
    if (kind === "success") {
      el.classList.add("text-tertiary");
    } else if (kind === "error") {
      el.classList.add("text-error");
    } else {
      el.classList.add("text-on-surface-variant");
    }
  }

  function initAuditForm() {
    const form = document.getElementById("audit-form");
    const statusEl = document.getElementById("audit-form-status");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const lang = pageLang();
      const str = formStrings(lang);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const webhookUrl = getAuditWebhookUrl(form);
      if (!webhookUrl) {
        setAuditFormStatus(statusEl, str.webhookMissing, "error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const fd = new FormData(form);
      const payload = {
        name: (fd.get("name") || "").toString().trim(),
        email: (fd.get("email") || "").toString().trim(),
        website: (fd.get("website") || "").toString().trim(),
        rooms: (fd.get("rooms") || "").toString().trim(),
        message: (fd.get("message") || "").toString().trim(),
        source: (form.getAttribute("data-form-source") || "").trim() || "rankhotel-ai-landing",
        submittedAt: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };

      setAuditFormStatus(statusEl, str.submitting, "info");
      form.setAttribute("aria-busy", "true");
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json, */*" },
          body: JSON.stringify(payload),
          mode: "cors",
          credentials: "omit",
        });

        if (!res.ok) {
          const msg = webhookErrorMessage(res.status, lang);
          setAuditFormStatus(statusEl, msg, "error");
          if (typeof console !== "undefined" && console.error) {
            console.error("Audit form webhook:", res.status, res.statusText);
          }
          return;
        }

        setAuditFormStatus(statusEl, str.success, "success");
        form.reset();
      } catch (err) {
        const isNetwork =
          err instanceof TypeError ||
          (err && String(err.message || "").toLowerCase().includes("fetch"));
        setAuditFormStatus(
          statusEl,
          isNetwork ? str.networkError : str.genericError,
          "error"
        );
        if (typeof console !== "undefined" && console.error) {
          console.error("Audit form webhook:", err);
        }
      } finally {
        form.removeAttribute("aria-busy");
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  function copyPageUrlStrings(lang) {
    if (lang === "en") {
      return {
        action: "Copy page link",
        done: "Link copied to clipboard",
        fail: "Could not copy link",
      };
    }
    return {
      action: "Copia il link della pagina",
      done: "Link copiato negli appunti",
      fail: "Impossibile copiare il link",
    };
  }

  function initCopyPageUrl() {
    const btn = document.querySelector("[data-copy-page-url]");
    if (!btn) return;

    const lang = pageLang();
    const str = copyPageUrlStrings(lang);
    btn.setAttribute("aria-label", str.action);
    const icon = btn.querySelector(".material-symbols-outlined");

    function fallbackCopy(text) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    }

    btn.addEventListener("click", function () {
      const url = window.location.href;
      const resetAria = function () {
        btn.setAttribute("aria-label", str.action);
      };

      function onSuccess() {
        btn.setAttribute("aria-label", str.done);
        if (icon) icon.textContent = "check";
        window.setTimeout(function () {
          resetAria();
          if (icon) icon.textContent = "share";
        }, 2200);
      }

      function onFail() {
        btn.setAttribute("aria-label", str.fail);
        window.setTimeout(resetAria, 2800);
      }

      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(url).then(onSuccess, function () {
          if (fallbackCopy(url)) onSuccess();
          else onFail();
        });
      } else if (fallbackCopy(url)) {
        onSuccess();
      } else {
        onFail();
      }
    });
  }

  function blogTocStrings(lang) {
    if (lang === "en") {
      return {
        summary: "On this page",
        navLabel: "Article contents",
      };
    }
    return {
      summary: "In questa pagina",
      navLabel: "Indice dell'articolo",
    };
  }

  function slugifyHeadingId(raw) {
    var s = (raw || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    s = s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return s || "section";
  }

  /** Build TOC from h2/h3 inside article.blog-article; mount into main [data-blog-toc]. */
  function initBlogTableOfContents() {
    var mount = document.querySelector("main [data-blog-toc]");
    var article = document.querySelector("article.blog-article");
    if (!mount || !article) return;

    var headings = Array.prototype.slice
      .call(article.querySelectorAll("h2, h3"))
      .filter(function (h) {
        return !h.closest(".blog-faq-section");
      });
    if (!headings.length) return;

    var used = Object.create(null);
    function ensureId(el) {
      if (el.id && String(el.id).trim()) return el.id;
      var base = slugifyHeadingId(el.textContent);
      var id = base;
      var n = 2;
      while (document.getElementById(id) || used[id]) {
        id = base + "-" + n;
        n += 1;
      }
      used[id] = true;
      el.id = id;
      return id;
    }

    headings.forEach(function (h) {
      ensureId(h);
    });

    var lang = pageLang();
    var str = blogTocStrings(lang);
    var topOl = document.createElement("ol");
    topOl.className = "blog-toc-list";
    var currentSubOl = null;

    headings.forEach(function (h) {
      var tag = h.tagName.toLowerCase();
      var text = (h.textContent || "").trim();
      if (!text) return;

      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = text;

      if (tag === "h2") {
        var li = document.createElement("li");
        li.className = "blog-toc-item blog-toc-item--h2";
        li.appendChild(a);
        currentSubOl = document.createElement("ol");
        currentSubOl.className = "blog-toc-sub";
        li.appendChild(currentSubOl);
        topOl.appendChild(li);
      } else {
        var li3 = document.createElement("li");
        li3.className = "blog-toc-item blog-toc-item--h3";
        li3.appendChild(a);
        if (currentSubOl) {
          currentSubOl.appendChild(li3);
        } else {
          li3.classList.add("blog-toc-item--orphan-h3");
          topOl.appendChild(li3);
        }
      }
    });

    var nav = document.createElement("nav");
    nav.className = "blog-toc-nav";
    nav.setAttribute("aria-label", str.navLabel);
    nav.appendChild(topOl);

    var details = document.createElement("details");
    details.className = "blog-toc-disclosure";
    var sidebarTitle = document.createElement("p");
    sidebarTitle.className = "blog-toc-sidebar-title";
    sidebarTitle.setAttribute("aria-hidden", "true");
    sidebarTitle.textContent = str.summary;
    var summary = document.createElement("summary");
    summary.className = "blog-toc-summary";
    summary.textContent = str.summary;
    details.appendChild(sidebarTitle);
    details.appendChild(summary);
    details.appendChild(nav);

    mount.innerHTML = "";
    mount.appendChild(details);

    function syncTocOpen() {
      details.open = mqBlogTocWide.matches;
    }

    syncTocOpen();
    mqBlogTocWide.addEventListener("change", syncTocOpen);
  }

  /** Hero headline: cycle LLM logos from assets/images/llms-logo on all [data-hero-model-rotate] imgs. */
  function initHeroModelRotate() {
    var els = document.querySelectorAll("[data-hero-model-rotate]");
    if (!els.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    var base = (function () {
      var scripts = document.getElementsByTagName("script");
      for (var j = 0; j < scripts.length; j++) {
        var src = scripts[j].src;
        if (src && /\/script\.js(\?|$)/i.test(src)) {
          return src.replace(/\/script\.js[^/]*$/i, "/assets/images/llms-logo/");
        }
      }
      return "./assets/images/llms-logo/";
    })();
    var slides = [
      { file: "chatgpt.webp", alt: "ChatGPT" },
      { file: "gemini.webp", alt: "Gemini" },
      { file: "copilot.webp", alt: "Copilot" },
      { file: "perplexity.webp", alt: "Perplexity" },
      { file: "google-ai.webp", alt: "Google AI" },
      { file: "aioverview.webp", alt: "AI Overview" },
    ];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % slides.length;
      var slide = slides[i];
      els.forEach(function (el) {
        el.style.opacity = "0";
      });
      window.setTimeout(function () {
        els.forEach(function (el) {
          el.src = base + slide.file;
          el.alt = slide.alt;
          el.style.opacity = "1";
        });
      }, 220);
    }, 2500);
  }

  function boot() {
    initNav();
    initAuditForm();
    initCopyPageUrl();
    initBlogTableOfContents();
    initHeroModelRotate();
  }

  var hasBooted = false;
  function bootOnce() {
    if (hasBooted) return;
    hasBooted = true;
    boot();
  }

  function startAfterIncludes() {
    if (window.__rhIncludesPending) {
      document.addEventListener("includes:ready", bootOnce, { once: true });
    } else {
      bootOnce();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAfterIncludes, { once: true });
  } else {
    startAfterIncludes();
  }
})();
