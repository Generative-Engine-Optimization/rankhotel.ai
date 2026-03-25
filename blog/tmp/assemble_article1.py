"""Assemble article 1 pages from HTML fragments."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TMP = ROOT / "tmp"

FRAG_IT = (TMP / "_fragment_a1_it.html").read_text(encoding="utf-8")
FRAG_EN = (TMP / "_fragment_a1_en.html").read_text(encoding="utf-8")

SLUG = "ai-search-hotels-2026-aeo-seo"
URL_EN = f"https://rankhotel.ai/blog/{SLUG}.html"
URL_IT = f"https://rankhotel.ai/it/blog/{SLUG}.html"

JSONLD_ARTICLE_IT = r"""
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "AI Search e Hotel: guida AEO e strategie di ottimizzazione nel 2026",
    "description": "Guida RankHotel.ai su AEO e SEO per hotel: motori AI, dati strutturati e KPI di ricavo.",
    "author": {"@type": "Organization", "name": "RankHotel.AI"},
    "publisher": {
      "@type": "Organization",
      "name": "RankHotel.AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg"
      }
    },
    "mainEntityOfPage": {"@type": "WebPage", "@id": "%s"},
    "datePublished": "2026-04-01",
    "inLanguage": "it-IT"
  }
  </script>
""" % URL_IT

JSONLD_FAQ_IT = r"""
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Cos'è la Answer Engine Optimization (AEO)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "È l'ottimizzazione per motori AI che consente a un hotel di essere scelto come risposta diretta, non solo come link in SERP."
        }
      },
      {
        "@type": "Question",
        "name": "Qual è la differenza tra AEO e SEO tradizionale?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La SEO punta a posizionarsi nei risultati di Google; l'AEO a essere citato dalle AI. La SEO usa keyword; l'AEO richiede dati strutturati e linguaggio naturale."
        }
      },
      {
        "@type": "Question",
        "name": "Quali dati strutturati servono a un hotel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hotel/LodgingBusiness, Offer, Review, HotelRoom, FAQPage, GeoCoordinates e PriceSpecification."
        }
      }
    ]
  }
  </script>
"""

JSONLD_ARTICLE_EN = r"""
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "AI search & hotels: AEO guide and 2026 optimization strategies",
    "description": "How hotels can earn AI citations with Answer Engine Optimization, structured data, and revenue KPIs.",
    "author": {"@type": "Organization", "name": "RankHotel.AI"},
    "publisher": {
      "@type": "Organization",
      "name": "RankHotel.AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg"
      }
    },
    "mainEntityOfPage": {"@type": "WebPage", "@id": "%s"},
    "datePublished": "2026-04-01",
    "inLanguage": "en-US"
  }
  </script>
""" % URL_EN

JSONLD_FAQ_EN = r"""
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Answer Engine Optimization (AEO)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Optimization for AI answer engines so a hotel can be chosen as a direct answer—not only as a link in traditional SERPs."
        }
      },
      {
        "@type": "Question",
        "name": "How is AEO different from traditional SEO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SEO targets rankings in Google results; AEO targets being cited by AI systems. SEO leans on keywords; AEO needs structured data and natural-language content."
        }
      },
      {
        "@type": "Question",
        "name": "Which structured data types matter for hotels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hotel/LodgingBusiness, Offer, Review, HotelRoom, FAQPage, GeoCoordinates, and PriceSpecification."
        }
      }
    ]
  }
  </script>
"""


def page_it():
    return f"""<!DOCTYPE html>
<html class="dark" lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="../../assets/images/logo/rankhotel_ai_Favicon.ico" type="image/x-icon" />
  <meta name="description" content="Guida AEO e SEO per hotel nel 2026: motori AI, dati strutturati, contenuti e KPI di ricavo." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="canonical" href="{URL_IT}" />
  <link rel="alternate" hreflang="en" href="{URL_EN}" />
  <link rel="alternate" hreflang="it" href="{URL_IT}" />
  <link rel="alternate" hreflang="x-default" href="{URL_EN}" />
  <title>AI Search e Hotel 2026 – Guida AEO &amp; SEO | RankHotel.AI</title>
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:url" content="{URL_IT}" />
  <meta property="og:title" content="AI Search e Hotel: guida AEO e strategie 2026" />
  <meta property="og:description" content="Strategie AEO per hotel nell'era dei motori AI. Guida pratica RankHotel.ai." />
  <meta property="og:image" content="https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css" />
{JSONLD_ARTICLE_IT}
{JSONLD_FAQ_IT}
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script src="../../script.js"></script>
  <script src="../../assets/js/embeds/cal-demo.js"></script>
</head>
<body class="selection:bg-primary/30">
  <a class="skip-link" href="#main-content">Salta al contenuto principale</a>
  <header class="site-header nav-shell fixed top-0 left-0 right-0 z-[var(--nav-z)]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
      <nav class="nav-bar-island relative px-4 sm:px-5 md:px-6 py-3 sm:py-3.5" aria-label="Navigazione principale">
        <div class="flex items-center justify-between gap-3 w-full">
          <a class="block shrink-0" href="../../">
            <img src="../../assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI" class="h-11 sm:h-12 md:h-[3.5rem] lg:h-[3.75rem] w-auto object-contain" width="1244" height="276" decoding="async" fetchpriority="high" loading="eager" />
          </a>
          <div id="primary-menu" class="primary-menu md:flex-1 md:justify-center md:gap-7 lg:gap-9">
            <a class="nav-link" href="../../#product">Organic Growth Engine</a>
            <a class="nav-link" href="../../#pricing">Pricing</a>
            <a class="nav-link" href="../../#faq">FAQ</a>
            <a class="nav-link" href="../blog.html">Blog</a>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a class="nav-lang inline-flex items-center justify-center min-w-[40px] min-h-[44px] sm:min-w-[44px]" href="{URL_EN}" hreflang="en" lang="en" title="English" aria-label="Versione in inglese">EN</a>
            <button type="button" class="hidden sm:inline-flex bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold text-sm electric-glow active:scale-95 transition-transform items-center justify-center min-h-[44px] border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Richiedi audit gratuito</button>
            <button type="button" class="nav-toggle md:hidden" aria-controls="primary-menu" aria-expanded="false" aria-label="Apri menu di navigazione"><span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
            <button type="button" class="sm:hidden inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary-container electric-glow border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Demo</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <main id="main-content" class="pt-[6.75rem] sm:pt-28 pb-16 md:pb-24">
    <article class="blog-article max-w-3xl mx-auto px-4 sm:px-6">
      <p class="blog-meta"><a class="text-primary no-underline hover:underline" href="../blog.html">Blog</a> · 1 aprile 2026</p>
{FRAG_IT}
    </article>
  </main>
  <footer class="site-footer w-full mt-12 md:mt-20 px-4 sm:px-6 pb-6 md:pb-10">
    <div class="max-w-5xl mx-auto">
      <div class="footer-island px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-x-10 xl:gap-x-14">
          <div class="md:col-span-2 lg:col-span-2">
            <a class="inline-block mb-8" href="../../"><img src="../../assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI" class="h-11 sm:h-12 md:h-[3.5rem] w-auto object-contain" width="1244" height="276" loading="lazy" decoding="async" /></a>
            <p class="footer-tagline">Visibilità AI per hotel: come ti presenti quando i viaggiatori chiedono a ChatGPT, Gemini e Perplexity.</p>
          </div>
          <nav class="md:col-span-1" aria-labelledby="fp-it"><h2 id="fp-it" class="footer-col-title">Prodotto</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../../#product">Organic Growth Engine</a></li><li><a class="footer-link" href="../../#pricing">Pricing</a></li><li><a class="footer-link" href="../../#faq">FAQ</a></li></ul></nav>
          <nav class="md:col-span-1" aria-labelledby="fr-it"><h2 id="fr-it" class="footer-col-title">Risorse</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../blog.html">Blog</a></li><li><a class="footer-link" href="../../legal/cookie-settings.html">Impostazioni cookie</a></li></ul></nav>
          <nav class="md:col-span-2 lg:col-span-1" aria-labelledby="fc-it"><h2 id="fc-it" class="footer-col-title">Contatti</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Richiedi audit gratuito</button></li><li><a class="footer-link" href="../../#trial">Audit SEO &amp; GEO</a></li><li><a class="footer-link" href="../../legal/terms.html">Termini di servizio</a></li></ul></nav>
        </div>
        <div class="footer-meta mt-12 md:mt-14 pt-8 md:pt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
          <p class="footer-legal">© 2026 RankHotel.AI · Tutti i diritti riservati</p>
          <button type="button" class="footer-social self-start sm:self-auto" data-copy-page-url aria-label="Copia link alla pagina"><span class="material-symbols-outlined text-[1.35rem]" aria-hidden="true">share</span></button>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>
"""


def page_en():
    return f"""<!DOCTYPE html>
<html class="dark" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="../assets/images/logo/rankhotel_ai_Favicon.ico" type="image/x-icon" />
  <meta name="description" content="AEO &amp; SEO for hotels in 2026: AI engines, structured data, content, and revenue KPIs." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="canonical" href="{URL_EN}" />
  <link rel="alternate" hreflang="en" href="{URL_EN}" />
  <link rel="alternate" hreflang="it" href="{URL_IT}" />
  <link rel="alternate" hreflang="x-default" href="{URL_EN}" />
  <title>AI Search &amp; Hotels 2026 – AEO &amp; SEO Guide | RankHotel.AI</title>
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="{URL_EN}" />
  <meta property="og:title" content="AI search &amp; hotels: AEO guide and 2026 strategies" />
  <meta property="og:description" content="Practical AEO strategies for hotels in the AI era. RankHotel.AI guide." />
  <meta property="og:image" content="https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../style.css" />
{JSONLD_ARTICLE_EN}
{JSONLD_FAQ_EN}
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script src="../script.js"></script>
  <script src="../assets/js/embeds/cal-demo.js"></script>
</head>
<body class="selection:bg-primary/30">
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header nav-shell fixed top-0 left-0 right-0 z-[var(--nav-z)]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
      <nav class="nav-bar-island relative px-4 sm:px-5 md:px-6 py-3 sm:py-3.5" aria-label="Main navigation">
        <div class="flex items-center justify-between gap-3 w-full">
          <a class="block shrink-0" href="../">
            <img src="../assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI" class="h-11 sm:h-12 md:h-[3.5rem] lg:h-[3.75rem] w-auto object-contain" width="1244" height="276" decoding="async" fetchpriority="high" loading="eager" />
          </a>
          <div id="primary-menu" class="primary-menu md:flex-1 md:justify-center md:gap-7 lg:gap-9">
            <a class="nav-link" href="../#product">Organic Growth Engine</a>
            <a class="nav-link" href="../#pricing">Pricing</a>
            <a class="nav-link" href="../#faq">FAQ</a>
            <a class="nav-link" href="../blog.html">Blog</a>
          </div>
          <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a class="nav-lang inline-flex items-center justify-center min-w-[40px] min-h-[44px] sm:min-w-[44px]" href="{URL_IT}" hreflang="it" lang="it" title="Italiano" aria-label="Italian version">IT</a>
            <button type="button" class="hidden sm:inline-flex bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-xl font-semibold text-sm electric-glow active:scale-95 transition-transform items-center justify-center min-h-[44px] border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Book a demo</button>
            <button type="button" class="nav-toggle md:hidden" aria-controls="primary-menu" aria-expanded="false" aria-label="Open navigation menu"><span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
            <button type="button" class="sm:hidden inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary-container electric-glow border-0 cursor-pointer" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Demo</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <main id="main-content" class="pt-[6.75rem] sm:pt-28 pb-16 md:pb-24">
    <article class="blog-article max-w-3xl mx-auto px-4 sm:px-6">
      <p class="blog-meta"><a class="text-primary no-underline hover:underline" href="../blog.html">Blog</a> · April 1, 2026</p>
{FRAG_EN}
    </article>
  </main>
  <footer class="site-footer w-full mt-12 md:mt-20 px-4 sm:px-6 pb-6 md:pb-10">
    <div class="max-w-5xl mx-auto">
      <div class="footer-island px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-x-10 xl:gap-x-14">
          <div class="md:col-span-2 lg:col-span-2">
            <a class="inline-block mb-8" href="../"><img src="../assets/images/logo/logo-rankhotel.svg" alt="RankHotel.AI" class="h-11 sm:h-12 md:h-[3.5rem] w-auto object-contain" width="1244" height="276" loading="lazy" decoding="async" /></a>
            <p class="footer-tagline">AI visibility for hotels: how you show up when travelers ask ChatGPT, Gemini, and Perplexity.</p>
          </div>
          <nav class="md:col-span-1" aria-labelledby="fp-en"><h2 id="fp-en" class="footer-col-title">Product</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../#product">Organic Growth Engine</a></li><li><a class="footer-link" href="../#pricing">Pricing</a></li><li><a class="footer-link" href="../#faq">FAQ</a></li></ul></nav>
          <nav class="md:col-span-1" aria-labelledby="fr-en"><h2 id="fr-en" class="footer-col-title">Resources</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../blog.html">Blog</a></li><li><a class="footer-link" href="../legal/cookie-settings.html">Cookie settings</a></li></ul></nav>
          <nav class="md:col-span-2 lg:col-span-1" aria-labelledby="fc-en"><h2 id="fc-en" class="footer-col-title">Contact</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Book a demo</button></li><li><a class="footer-link" href="../#trial">SEO &amp; GEO audit</a></li><li><a class="footer-link" href="../legal/terms.html">Terms of service</a></li></ul></nav>
        </div>
        <div class="footer-meta mt-12 md:mt-14 pt-8 md:pt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
          <p class="footer-legal">© 2026 RankHotel.AI · All rights reserved</p>
          <button type="button" class="footer-social self-start sm:self-auto" data-copy-page-url aria-label="Copy page link"><span class="material-symbols-outlined text-[1.35rem]" aria-hidden="true">share</span></button>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>
"""


def main():
    (ROOT.parent / "it" / "blog" / f"{SLUG}.html").write_text(page_it(), encoding="utf-8")
    (ROOT / f"{SLUG}.html").write_text(page_en(), encoding="utf-8")
    print("written", SLUG)


if __name__ == "__main__":
    main()
