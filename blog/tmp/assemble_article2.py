"""Assemble article 2 (hotel SEO guide) EN/IT pages."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TMP = ROOT / "tmp"

FRAG_IT = (TMP / "_fragment_a2_it.html").read_text(encoding="utf-8")
FRAG_EN = (TMP / "_fragment_a2_en.html").read_text(encoding="utf-8")

SLUG = "hotel-seo-complete-guide"
URL_EN = f"https://rankhotel.ai/blog/{SLUG}.html"
URL_IT = f"https://rankhotel.ai/it/blog/{SLUG}.html"
DATE_PUBLISHED = "2026-03-15"

FAQ_PAIRS_IT = [
    (
        "Cos'è la SEO per hotel e perché è importante?",
        "È l'insieme delle strategie che ottimizzano il sito della struttura per apparire su Google quando i viaggiatori cercano un alloggio; riduce le commissioni OTA e aumenta le prenotazioni dirette.",
    ),
    (
        "Quanto tempo ci vuole per vedere risultati dalla SEO di un hotel?",
        "In genere i primi effetti in 3–6 mesi; il pieno potenziale spesso in 12–18 mesi.",
    ),
    (
        "Cos'è il Google Business Profile e come ottimizzarlo per un hotel?",
        "È la scheda gratuita su Maps e Search: NAP coerente, categorie corrette, foto, descrizione locale, post e recensioni.",
    ),
    (
        "Cosa significa NAP e perché è importante per la SEO del mio hotel?",
        "Nome, indirizzo e telefono devono coincidere su sito, OTA e directory: coerenza = affidabilità per Google.",
    ),
    (
        "Come trovare le keyword giuste per il sito del mio hotel?",
        "Parti dalle domande reali degli ospiti; usa Search Console e strumenti di ricerca keyword; privilegia long-tail ad alta intenzione.",
    ),
    (
        "Cos'è l'AEO (Answer Engine Optimization) per un hotel?",
        "È l'ottimizzazione per essere citati nelle risposte dei motori AI oltre ai risultati classici su Google.",
    ),
    (
        "L'AEO sostituirà la SEO tradizionale per gli hotel?",
        "No: si integra. Conviene presidiare ricerca classica e risposte AI.",
    ),
    (
        "Quali sono i Core Web Vitals e perché contano per un hotel?",
        "LCP, INP e CLS misurano velocità, reattività e stabilità della pagina; impattano ranking ed esperienza mobile.",
    ),
    (
        "Cosa sono i dati strutturati Schema.org e devo usarli sul sito del mio hotel?",
        "Sono markup che spiegano a Google e alle AI contenuti e entità (hotel, camere, FAQ); consigliati per snippet e visibilità AI.",
    ),
    (
        "Il mio hotel ha bisogno di un sito dedicato o basta la scheda Booking?",
        "Un sito ufficiale è indispensabile per SEO, brand, dati e prenotazioni dirette; le OTA sono canali complementari.",
    ),
]

FAQ_PAIRS_EN = [
    (
        "What is hotel SEO and why does it matter?",
        "It is the practice of improving your hotel website so travelers find you in Google—reducing OTA commissions and growing direct bookings.",
    ),
    (
        "How long until SEO results for a hotel?",
        "Early signals often appear within months; meaningful results commonly emerge over 3–6 months and compound over 12–18 months.",
    ),
    (
        "How do I optimize Google Business Profile for a hotel?",
        "Keep NAP consistent, choose correct categories, add photos, use natural local keywords, post updates, and respond to reviews.",
    ),
    (
        "What is NAP and why does consistency matter?",
        "Name, address, and phone must match across your site and major listings to build trust with Google.",
    ),
    (
        "How do I find the right keywords for my hotel website?",
        "Start from real guest questions; validate with Search Console and keyword tools; prioritize long-tail, high-intent queries.",
    ),
    (
        "What is AEO (Answer Engine Optimization) for hotels?",
        "Optimization to be cited in AI answers in addition to traditional search results.",
    ),
    (
        "Will AEO replace traditional SEO for hotels?",
        "No—it extends SEO. Winning strategies usually cover both classic search and AI surfaces.",
    ),
    (
        "What are Core Web Vitals and why do they matter?",
        "LCP, INP, and CLS measure loading, interactivity, and layout stability—important for rankings and mobile UX.",
    ),
    (
        "What is Schema.org structured data and should hotels use it?",
        "Machine-readable markup that clarifies entities like hotels, rooms, and FAQs to Google and AI systems.",
    ),
    (
        "Do I need a website if I am on Booking.com?",
        "Yes—an owned website is essential for brand, SEO, guest data, and direct bookings; OTAs are distribution channels.",
    ),
]


def faq_script(pairs):
    data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in pairs
        ],
    }
    return "  <script type=\"application/ld+json\">\n" + json.dumps(data, ensure_ascii=False, indent=2) + "\n  </script>\n"


def article_ld(lang: str):
    is_it = lang == "it"
    data = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": (
            "Guida completa alla SEO per hotel: come scalare Google e aumentare le prenotazioni dirette"
            if is_it
            else "Hotel SEO: rank on Google and grow direct bookings"
        ),
        "description": (
            "SEO tecnica, keyword, Local SEO, contenuti, link building, KPI e integrazione con AEO per hotel."
            if is_it
            else "Technical SEO, keywords, local SEO, content, links, KPIs, and how AEO fits alongside classic SEO."
        ),
        "author": {"@type": "Organization", "name": "RankHotel.AI"},
        "publisher": {
            "@type": "Organization",
            "name": "RankHotel.AI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg",
            },
        },
        "mainEntityOfPage": {"@type": "WebPage", "@id": URL_IT if is_it else URL_EN},
        "datePublished": DATE_PUBLISHED,
        "inLanguage": "it-IT" if is_it else "en-US",
    }
    return "  <script type=\"application/ld+json\">\n" + json.dumps(data, ensure_ascii=False, indent=2) + "\n  </script>\n"


JSONLD_ARTICLE_IT = article_ld("it")
JSONLD_ARTICLE_EN = article_ld("en")


def page_it():
    return f"""<!DOCTYPE html>
<html class="dark" lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="../../assets/images/logo/rankhotel_ai_Favicon.ico" type="image/x-icon" />
  <meta name="description" content="Guida SEO per hotel: Google, OTA, Local SEO, contenuti, KPI e AEO. FAQ e strategie pratiche." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="canonical" href="{URL_IT}" />
  <link rel="alternate" hreflang="en" href="{URL_EN}" />
  <link rel="alternate" hreflang="it" href="{URL_IT}" />
  <link rel="alternate" hreflang="x-default" href="{URL_EN}" />
  <title>Guida SEO per hotel: Google e prenotazioni dirette | RankHotel.AI</title>
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="it_IT" />
  <meta property="og:url" content="{URL_IT}" />
  <meta property="og:title" content="Guida SEO per hotel: scalare Google e le prenotazioni dirette" />
  <meta property="og:description" content="SEO tecnica, keyword, Local SEO, contenuti, link building e AEO per hotel." />
  <meta property="og:image" content="https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css" />
{JSONLD_ARTICLE_IT}
{faq_script(FAQ_PAIRS_IT)}
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
      <p class="blog-meta"><a class="text-primary no-underline hover:underline" href="../blog.html">Blog</a> · 15 marzo 2026</p>
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
          <nav class="md:col-span-1" aria-labelledby="fp2-it"><h2 id="fp2-it" class="footer-col-title">Prodotto</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../../#product">Organic Growth Engine</a></li><li><a class="footer-link" href="../../#pricing">Pricing</a></li><li><a class="footer-link" href="../../#faq">FAQ</a></li></ul></nav>
          <nav class="md:col-span-1" aria-labelledby="fr2-it"><h2 id="fr2-it" class="footer-col-title">Risorse</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../blog.html">Blog</a></li><li><a class="footer-link" href="../../legal/cookie-settings.html">Impostazioni cookie</a></li></ul></nav>
          <nav class="md:col-span-2 lg:col-span-1" aria-labelledby="fc2-it"><h2 id="fc2-it" class="footer-col-title">Contatti</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Richiedi audit gratuito</button></li><li><a class="footer-link" href="../../#trial">Audit SEO &amp; GEO</a></li><li><a class="footer-link" href="../../legal/terms.html">Termini di servizio</a></li></ul></nav>
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
  <meta name="description" content="Complete hotel SEO guide: Google rankings, OTAs, local SEO, content, KPIs, and AEO—plus FAQs." />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0a0a0a" />
  <link rel="canonical" href="{URL_EN}" />
  <link rel="alternate" hreflang="en" href="{URL_EN}" />
  <link rel="alternate" hreflang="it" href="{URL_IT}" />
  <link rel="alternate" hreflang="x-default" href="{URL_EN}" />
  <title>Hotel SEO: Google rankings &amp; direct bookings | RankHotel.AI</title>
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="{URL_EN}" />
  <meta property="og:title" content="Hotel SEO: rank on Google and grow direct bookings" />
  <meta property="og:description" content="Technical SEO, keywords, local SEO, content, links, KPIs, and AEO for hotels." />
  <meta property="og:image" content="https://rankhotel.ai/assets/images/logo/rankhotel-dark-white.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../style.css" />
{JSONLD_ARTICLE_EN}
{faq_script(FAQ_PAIRS_EN)}
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
      <p class="blog-meta"><a class="text-primary no-underline hover:underline" href="../blog.html">Blog</a> · March 15, 2026</p>
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
          <nav class="md:col-span-1" aria-labelledby="fp2-en"><h2 id="fp2-en" class="footer-col-title">Product</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../#product">Organic Growth Engine</a></li><li><a class="footer-link" href="../#pricing">Pricing</a></li><li><a class="footer-link" href="../#faq">FAQ</a></li></ul></nav>
          <nav class="md:col-span-1" aria-labelledby="fr2-en"><h2 id="fr2-en" class="footer-col-title">Resources</h2><ul class="space-y-1 list-none p-0 m-0"><li><a class="footer-link" href="../blog.html">Blog</a></li><li><a class="footer-link" href="../legal/cookie-settings.html">Cookie settings</a></li></ul></nav>
          <nav class="md:col-span-2 lg:col-span-1" aria-labelledby="fc2-en"><h2 id="fc2-en" class="footer-col-title">Contact</h2><ul class="space-y-1 list-none p-0 m-0"><li><button type="button" class="footer-link w-full sm:w-auto" data-cal-link="rankwit/rankhotel.ai" data-cal-namespace="rankhotel.ai" data-cal-config='{{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}'>Book a demo</button></li><li><a class="footer-link" href="../#trial">SEO &amp; GEO audit</a></li><li><a class="footer-link" href="../legal/terms.html">Terms of service</a></li></ul></nav>
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
