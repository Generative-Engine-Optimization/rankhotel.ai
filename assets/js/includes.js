(function () {
  "use strict";

  var TEMPLATES = {
    "/partials/en/header.html": '<header class="site-header nav-shell fixed top-0 left-0 right-0 z-[var(--nav-z)]"><div class="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4"><nav class="nav-bar-island relative px-4 sm:px-5 md:px-6 py-3 sm:py-3.5" aria-label="Main navigation"><div class="flex items-center justify-between gap-3 w-full"><a class="block shrink-0" href="/"><img src="/assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI: AI visibility for hotels" class="h-11 sm:h-12 md:h-[3.5rem] lg:h-[3.75rem] w-auto object-contain" width="1244" height="276" decoding="async" fetchpriority="high" loading="eager" /></a><div id="primary-menu" class="primary-menu md:flex-1 md:justify-center md:gap-7 lg:gap-9"><a class="nav-link" href="/#how-it-works">Organic Growth Engine</a><a class="nav-link" href="/pricing.html">Pricing</a><a class="nav-link" href="/#faq">FAQ</a><a class="nav-link" href="/blog.html">Blog</a></div><div class="flex items-center gap-1.5 sm:gap-3 shrink-0"><a class="nav-lang inline-flex items-center justify-center min-w-[40px] min-h-[44px] sm:min-w-[44px]" href="/it/" hreflang="it" lang="it" title="Italiano" aria-label="Italian version">IT</a><button type="button" class="hidden sm:inline-flex bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold text-sm electric-glow active:scale-95 transition-transform items-center justify-center min-h-[44px] border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'>Book a demo</button><button type="button" class="nav-toggle md:hidden" aria-controls="primary-menu" aria-expanded="false" aria-label="Open navigation menu"><span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span></button><button type="button" class="sm:hidden inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary-container electric-glow border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'>Demo</button></div></div></nav></div></header>',
    "/partials/en/footer.html": '<footer class="site-footer w-full mt-20 md:mt-32 px-4 sm:px-6 pb-6 md:pb-10"><div class="max-w-5xl mx-auto"><div class="footer-island px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14"><div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-x-10 xl:gap-x-14"><div class="md:col-span-2 lg:col-span-2"><a class="inline-block mb-8" href="https://www.rankwit.ai/"><img src="/assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI: AI visibility for hotels" class="h-11 sm:h-12 md:h-[3.5rem] w-auto object-contain" width="1244" height="276" loading="lazy" decoding="async" /></a><p class="footer-tagline">AI visibility for hotels: how you show up when travelers ask ChatGPT, Gemini, and Perplexity.</p></div><nav class="md:col-span-1" aria-labelledby="footer-product"><h2 id="footer-product" class="footer-col-title">Product</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="/#how-it-works">Organic Growth Engine</a></li><li><a class="footer-link" href="/pricing.html">Pricing</a></li><li><a class="footer-link" href="/#faq">FAQ</a></li></ul></nav><nav class="md:col-span-1" aria-labelledby="footer-resources"><h2 id="footer-resources" class="footer-col-title">Resources</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="/blog.html">Blog</a></li><li><a class="footer-link" href="/legal/cookie-settings.html">Cookie settings</a></li></ul></nav><nav class="md:col-span-2 lg:col-span-1" aria-labelledby="footer-contact"><h2 id="footer-contact" class="footer-col-title">Contact</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'>Book a demo</button></li><li><a class="footer-link" href="/#trial">SEO &amp; GEO audit</a></li><li><a class="footer-link" href="/legal/terms.html">Terms of service</a></li></ul></nav></div><div class="footer-meta mt-12 md:mt-14 pt-8 md:pt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6"><p class="footer-legal">© 2026 RankHotel.AI · All rights reserved</p><button type="button" class="footer-social self-start sm:self-auto" data-copy-page-url aria-label="Copy page link"><span class="material-symbols-outlined text-[1.35rem]" aria-hidden="true">share</span></button></div></div></div></footer>',
    "/partials/it/header.html": '<header class="site-header nav-shell fixed top-0 left-0 right-0 z-[var(--nav-z)]"><div class="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4"><nav class="nav-bar-island relative px-4 sm:px-5 md:px-6 py-3 sm:py-3.5" aria-label="Navigazione principale"><div class="flex items-center justify-between gap-3 w-full"><a class="block shrink-0" href="/it/"><img src="/assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI: visibilità AI per hotel" class="h-11 sm:h-12 md:h-[3.5rem] lg:h-[3.75rem] w-auto object-contain" width="1244" height="276" decoding="async" fetchpriority="high" loading="eager" /></a><div id="primary-menu" class="primary-menu md:flex-1 md:justify-center md:gap-7 lg:gap-9"><a class="nav-link" href="/it/#how-it-works">Organic Growth Engine</a><a class="nav-link" href="/it/pricing.html">Pricing</a><a class="nav-link" href="/it/#faq">FAQ</a><a class="nav-link" href="/it/blog.html">Blog</a></div><div class="flex items-center gap-1.5 sm:gap-3 shrink-0"><a class="nav-lang inline-flex items-center justify-center min-w-[40px] min-h-[44px] sm:min-w-[44px]" href="/" hreflang="en" lang="en" title="English" aria-label="Versione in inglese">EN</a><button type="button" class="hidden sm:inline-flex bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold text-sm electric-glow active:scale-95 transition-transform items-center justify-center min-h-[44px] border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'>Prenota una call</button><button type="button" class="nav-toggle md:hidden" aria-controls="primary-menu" aria-expanded="false" aria-label="Apri menu di navigazione"><span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span></button><button type="button" class="sm:hidden inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary-container electric-glow border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'>Audit gratis</button></div></div></nav></div></header>',
    "/partials/it/footer.html": '<footer class="site-footer w-full mt-20 md:mt-32 px-4 sm:px-6 pb-6 md:pb-10"><div class="max-w-5xl mx-auto"><div class="footer-island px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14"><div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-x-10 xl:gap-x-14"><div class="md:col-span-2 lg:col-span-2"><a class="inline-block mb-8" href="https://www.rankwit.ai/it"><img src="/assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI: visibilità AI per hotel" class="h-11 sm:h-12 md:h-[3.5rem] w-auto object-contain" width="1244" height="276" loading="lazy" decoding="async" /></a><div class="footer-tagline max-w-[min(42rem,100%)] space-y-3"><p class="m-0">RankHotel è un servizio verticale di RankWit.AI, azienda specializzata nello sviluppo di software e agenti AI per l\'ottimizzazione della visibilità su motori di ricerca e piattaforme di AI search.</p><p class="m-0">Rankwit SRL Società Benifit copyright 2026 @Reimaging SEO</p></div></div><nav class="md:col-span-1" aria-labelledby="footer-product"><h2 id="footer-product" class="footer-col-title">Prodotto</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="/it/#how-it-works">Organic Growth Engine</a></li><li><a class="footer-link" href="/it/pricing.html">Pricing</a></li><li><a class="footer-link" href="/it/#faq">FAQ</a></li></ul></nav><nav class="md:col-span-1" aria-labelledby="footer-resources"><h2 id="footer-resources" class="footer-col-title">Risorse</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="/it/blog.html">Blog</a></li><li><a class="footer-link" href="/legal/cookie-settings.html">Impostazioni cookie</a></li></ul></nav><nav class="md:col-span-2 lg:col-span-1" aria-labelledby="footer-contact"><h2 id="footer-contact" class="footer-col-title">Contatti</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config=\'{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}\'Prenota una call</button></li><li><a class="footer-link" href="/it/#trial">SEO &amp; GEO audit</a></li><li><a class="footer-link" href="/legal/terms.html">Termini di servizio</a></li></ul></nav></div><div class="footer-meta mt-12 md:mt-14 pt-8 md:pt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-6"><button type="button" class="footer-social self-start sm:self-auto" data-copy-page-url aria-label="Copia il link della pagina"><span class="material-symbols-outlined text-[1.35rem]" aria-hidden="true">share</span></button></div></div></div></footer>'
  };

  function getIncludesScriptUrl() {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      var src = scripts[i].getAttribute("src") || "";
      if (/\/includes\.js(?:\?|#|$)/i.test(src)) {
        try {
          return new URL(src, window.location.href);
        } catch (_) {
          return null;
        }
      }
    }
    return null;
  }

  function getProjectRootUrl() {
    var scriptUrl = getIncludesScriptUrl();
    if (!scriptUrl) return null;
    var path = scriptUrl.pathname.replace(/\\/g, "/");
    var marker = "/assets/js/includes.js";
    var idx = path.toLowerCase().lastIndexOf(marker);
    if (idx === -1) return null;
    var rootPath = path.slice(0, idx + 1);
    return new URL(rootPath, scriptUrl.origin);
  }

  function normalizePath(input) {
    return String(input || "").replace(/\\/g, "/").replace(/\/+/g, "/");
  }

  function templateByPath(src) {
    var key = normalizePath(src);
    if (TEMPLATES[key]) return TEMPLATES[key];
    if (key.charAt(0) !== "/" && TEMPLATES["/" + key]) return TEMPLATES["/" + key];
    return "";
  }

  function absolutizeRootPaths(scopeEl) {
    if (window.location.protocol !== "file:") return;
    var root = getProjectRootUrl();
    if (!root || !scopeEl) return;

    scopeEl.querySelectorAll("[href^='/'],[src^='/']").forEach(function (el) {
      var attr = el.hasAttribute("href") ? "href" : "src";
      var v = el.getAttribute(attr) || "";
      if (!v || v.indexOf("//") === 0) return;
      el.setAttribute(attr, new URL(v.replace(/^\/+/, ""), root).href);
    });
  }

  function dispatchReady() {
    window.__rhIncludesPending = false;
    document.dispatchEvent(new CustomEvent("includes:ready"));
  }

  async function loadIncludes() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-include]"));
    if (!nodes.length) {
      dispatchReady();
      return;
    }

    window.__rhIncludesPending = true;

    nodes.forEach(function (node) {
        var src = (node.getAttribute("data-include") || "").trim();
        if (!src) return;

        var html = templateByPath(src);
        if (!html) {
          if (typeof console !== "undefined" && console.error) {
            console.error("Include template not found:", src);
          }
          return;
        }

        node.insertAdjacentHTML("beforebegin", html);
        var injected = node.previousElementSibling;
        node.remove();

        absolutizeRootPaths(injected);

        if (/\/partials\/(?:en|it)\/header\.html$/i.test(src)) {
          var langHref = (node.getAttribute("data-lang-href") || "").trim();
          if (langHref) {
            var langEl = document.querySelector(".nav-lang");
            if (langEl) {
              if (window.location.protocol === "file:") {
                var root = getProjectRootUrl();
                langEl.setAttribute("href", root ? new URL(langHref.replace(/^\/+/, ""), root).href : langHref);
              } else {
                langEl.setAttribute("href", langHref);
              }
            }
          }
        }
      });

    dispatchReady();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadIncludes, { once: true });
  } else {
    loadIncludes();
  }
})();
