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

  function closeMenu(toggle, panel) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-label", "Apri menu di navigazione");
  }

  function openMenu(toggle, panel) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    toggle.setAttribute("aria-label", "Chiudi menu di navigazione");
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

  function webhookErrorMessage(status) {
    if (status === 410 || status === 404) {
      return (
        "Webhook Make non più attivo (errore " +
        status +
        "). In Make.com apri lo scenario, assicurati che sia acceso, aggiungi o rinnova il modulo «Webhook personalizzato», copia il nuovo indirizzo e sostituiscilo nell’attributo data-webhook del form in index.html."
      );
    }
    if (status === 403 || status === 401) {
      return "Accesso al webhook rifiutato. Controlla in Make eventuali chiavi API o restrizioni sul modulo Webhook.";
    }
    return "Invio non riuscito (errore server " + status + "). Riprova tra poco o verifica lo scenario Make.";
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
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const webhookUrl = getAuditWebhookUrl(form);
      if (!webhookUrl) {
        setAuditFormStatus(
          statusEl,
          "Manca l’URL del webhook: imposta data-webhook sul form oppure window.RANKHOTEL_MAKE_WEBHOOK.",
          "error"
        );
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
        source: "rankhotel-ai-landing",
        submittedAt: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      };

      setAuditFormStatus(statusEl, "Invio in corso…", "info");
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
          const msg = webhookErrorMessage(res.status);
          setAuditFormStatus(statusEl, msg, "error");
          if (typeof console !== "undefined" && console.error) {
            console.error("Audit form webhook:", res.status, res.statusText);
          }
          return;
        }

        setAuditFormStatus(
          statusEl,
          "Richiesta inviata. Ti contatteremo al più presto.",
          "success"
        );
        form.reset();
      } catch (err) {
        const isNetwork =
          err instanceof TypeError ||
          (err && String(err.message || "").toLowerCase().includes("fetch"));
        setAuditFormStatus(
          statusEl,
          isNetwork
            ? "Connessione bloccata o rete assente. Se usi il sito da file:// prova da un server HTTP; se in console compare un errore CORS, abilita le richieste cross-origin sul webhook in Make o usa un proxy."
            : "Invio non riuscito. Riprova tra poco.",
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

  function boot() {
    initNav();
    initAuditForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
