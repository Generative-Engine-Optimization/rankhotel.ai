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

  /** Hero headline: cycle model names (ChatGPT → Gemini → Claude) in sync on all [data-hero-model-rotate] nodes. */
  function initHeroModelRotate() {
    var els = document.querySelectorAll("[data-hero-model-rotate]");
    if (!els.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    var models = ["ChatGPT", "Gemini", "Claude"];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % models.length;
      var label = models[i];
      els.forEach(function (el) {
        el.style.opacity = "0";
      });
      window.setTimeout(function () {
        els.forEach(function (el) {
          el.textContent = label;
          el.style.opacity = "1";
        });
      }, 220);
    }, 2500);
  }

  function boot() {
    initNav();
    initAuditForm();
    initHeroModelRotate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
