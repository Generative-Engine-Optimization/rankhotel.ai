(function () {
  "use strict";

  var MOBILE_MQ = "(max-width: 767px)";

  var ATTRACTIONS = [
    {
      id: "colosseum",
      name: "Colosseum",
      lat: 41.8902,
      lng: 12.4922,
      aiScore: 96,
      category: "ancient",
      sampleQuery: "best things to do in Rome in 3 days",
      blurb:
        "Almost always cited for first-time Rome itineraries and “iconic landmark” queries.",
    },
    {
      id: "trevi",
      name: "Trevi Fountain",
      lat: 41.9009,
      lng: 12.4833,
      aiScore: 94,
      category: "centro",
      sampleQuery: "romantic weekend in Rome what to see",
      blurb:
        "Frequently recommended for short trips and romantic or photo-focused prompts.",
    },
    {
      id: "st-peters",
      name: "St. Peter's Basilica",
      lat: 41.9022,
      lng: 12.4539,
      aiScore: 95,
      category: "vatican",
      sampleQuery: "Vatican City highlights in one day",
      blurb:
        "A default recommendation for faith, architecture, and St. Peter’s Square itineraries.",
    },
    {
      id: "vatican-museums",
      name: "Vatican Museums",
      lat: 41.9065,
      lng: 12.4534,
      aiScore: 93,
      category: "vatican",
      sampleQuery: "Vatican museums tickets and what to see first",
      blurb:
        "Dominant answer for art, Vatican City, and full-day museum plans.",
    },
    {
      id: "sistine",
      name: "Sistine Chapel",
      lat: 41.9029,
      lng: 12.4545,
      aiScore: 92,
      category: "vatican",
      sampleQuery: "Michelangelo Sistine Chapel visit tips",
      blurb:
        "Often named explicitly when users ask for Renaissance art inside the Vatican.",
    },
    {
      id: "pantheon",
      name: "Pantheon",
      lat: 41.8986,
      lng: 12.4768,
      aiScore: 91,
      category: "ancient",
      sampleQuery: "ancient Rome architecture must-see buildings",
      blurb:
        "Strong presence in architecture and ancient Rome roundups.",
    },
    {
      id: "palatine",
      name: "Palatine Hill",
      lat: 41.8894,
      lng: 12.4875,
      aiScore: 90,
      category: "ancient",
      sampleQuery: "Roman Forum and Palatine Hill tickets",
      blurb:
        "Bundled with Forum/Colosseum answers for “ancient Rome in one day.”",
    },
    {
      id: "forum",
      name: "Roman Forum",
      lat: 41.8916,
      lng: 12.4863,
      aiScore: 89,
      category: "ancient",
      sampleQuery: "Colosseum and Roman Forum visit plan",
      blurb:
        "Often paired with the Colosseum in historical and walking-tour lists.",
    },
    {
      id: "piazza-venezia",
      name: "Piazza Venezia",
      lat: 41.8959,
      lng: 12.4823,
      aiScore: 89,
      category: "centro",
      sampleQuery: "central Rome walking route from Piazza Venezia",
      blurb:
        "Common anchor for “historic center” and monument-to-monument routes.",
    },
    {
      id: "borghese",
      name: "Galleria Borghese",
      lat: 41.914,
      lng: 12.4921,
      aiScore: 88,
      category: "centro",
      sampleQuery: "best art museums in Rome besides the Vatican",
      blurb:
        "Frequently cited for sculpture, Bernini, and timed-entry museum plans.",
    },
    {
      id: "spanish-steps",
      name: "Spanish Steps",
      lat: 41.906,
      lng: 12.4828,
      aiScore: 86,
      category: "centro",
      sampleQuery: "where to shop and walk in central Rome",
      blurb:
        "Common in shopping and central Rome neighborhood suggestions.",
    },
    {
      id: "popolo",
      name: "Piazza del Popolo",
      lat: 41.9106,
      lng: 12.4762,
      aiScore: 86,
      category: "centro",
      sampleQuery: "north Rome gate and Piazza del Popolo walk",
      blurb:
        "Shows up in “arrival from Flaminio” and panoramic city-entry itineraries.",
    },
    {
      id: "vittoriano",
      name: "Vittoriano (Altare della Patria)",
      lat: 41.8947,
      lng: 12.4829,
      aiScore: 87,
      category: "centro",
      sampleQuery: "Rome monument with view over the Forum",
      blurb:
        "Often suggested for viewpoints and monumental Rome photo stops.",
    },
    {
      id: "navona",
      name: "Piazza Navona",
      lat: 41.8992,
      lng: 12.473,
      aiScore: 84,
      category: "baroque",
      sampleQuery: "beautiful squares in Rome at night",
      blurb:
        "Shows up often for baroque Rome and evening stroll prompts.",
    },
    {
      id: "campo",
      name: "Campo de' Fiori",
      lat: 41.8956,
      lng: 12.4722,
      aiScore: 85,
      category: "centro",
      sampleQuery: "Rome food market and aperitivo neighborhood",
      blurb:
        "Popular for market mornings and nightlife-adjacent centro lists.",
    },
    {
      id: "trastevere-sm",
      name: "Basilica of Santa Maria in Trastevere",
      lat: 41.8895,
      lng: 12.4695,
      aiScore: 78,
      category: "centro",
      sampleQuery: "evening in Trastevere what to visit",
      blurb:
        "Named in Trastevere walking routes and “authentic Rome” suggestions.",
    },
    {
      id: "trastevere-piazza",
      name: "Piazza Trilussa area (Trastevere)",
      lat: 41.8875,
      lng: 12.4685,
      aiScore: 83,
      category: "centro",
      sampleQuery: "where to eat in Trastevere Rome",
      blurb:
        "Frequent in dining- and neighborhood-focused travel answers.",
    },
    {
      id: "farnesina",
      name: "Villa Farnesina",
      lat: 41.8882,
      lng: 12.4674,
      aiScore: 77,
      category: "baroque",
      sampleQuery: "Raphael frescoes in Rome off the beaten path",
      blurb:
        "Appears in art-history and quieter Trastevere itineraries.",
    },
    {
      id: "circus",
      name: "Circus Maximus",
      lat: 41.8861,
      lng: 12.4935,
      aiScore: 84,
      category: "ancient",
      sampleQuery: "ancient chariot stadium Rome visit",
      blurb:
        "Often bundled with Palatine/Forum for ancient city storytelling.",
    },
    {
      id: "bocca",
      name: "Bocca della Verità",
      lat: 41.8868,
      lng: 12.4834,
      aiScore: 79,
      category: "centro",
      sampleQuery: "fun free things to do near the Forum",
      blurb:
        "A recurring “quick stop” in family and first-timer Rome lists.",
    },
    {
      id: "argentino",
      name: "Largo di Torre Argentina",
      lat: 41.8959,
      lng: 12.4767,
      aiScore: 81,
      category: "ancient",
      sampleQuery: "Julius Caesar assassination site Rome",
      blurb:
        "Cited in history-themed prompts and downtown walking threads.",
    },
    {
      id: "capitoline",
      name: "Capitoline Museums",
      lat: 41.8932,
      lng: 12.4831,
      aiScore: 82,
      category: "ancient",
      sampleQuery: "museums on Capitoline Hill Rome",
      blurb:
        "Recommended for sculpture and civic history after the Forum.",
    },
    {
      id: "caracalla",
      name: "Baths of Caracalla",
      lat: 41.8788,
      lng: 12.4924,
      aiScore: 81,
      category: "ancient",
      sampleQuery: "ancient Roman baths you can visit in Rome",
      blurb:
        "Strong in “beyond the centro” ancient Rome suggestions.",
    },
    {
      id: "maggiori",
      name: "Santa Maria Maggiore",
      lat: 41.8976,
      lng: 12.4984,
      aiScore: 83,
      category: "centro",
      sampleQuery: "major basilicas in Rome to visit",
      blurb:
        "Common in religious art and major church circuits.",
    },
    {
      id: "lateran",
      name: "Archbasilica of St. John Lateran",
      lat: 41.8859,
      lng: 12.5055,
      aiScore: 80,
      category: "centro",
      sampleQuery: "mother church of Rome Lateran",
      blurb:
        "Appears in papal history and “four major basilicas” answers.",
    },
    {
      id: "clemente",
      name: "Basilica of San Clemente",
      lat: 41.889,
      lng: 12.4988,
      aiScore: 76,
      category: "ancient",
      sampleQuery: "underground archaeological sites in Rome",
      blurb:
        "Often cited for layered history and crypt visits.",
    },
    {
      id: "massimo",
      name: "Palazzo Massimo (National Roman Museum)",
      lat: 41.9015,
      lng: 12.4995,
      aiScore: 75,
      category: "centro",
      sampleQuery: "best museums for Roman statues in Rome",
      blurb:
        "Shows up in museum-heavy and rainy-day Rome plans.",
    },
    {
      id: "gianicolo",
      name: "Gianicolo viewpoint",
      lat: 41.8883,
      lng: 12.4615,
      aiScore: 82,
      category: "centro",
      sampleQuery: "best sunset view in Rome free",
      blurb:
        "Popular for panoramas and romantic evening suggestions.",
    },
    {
      id: "keyhole",
      name: "Aventine Keyhole",
      lat: 41.8834,
      lng: 12.4768,
      aiScore: 74,
      category: "centro",
      sampleQuery: "secret view St Peter's through a keyhole Rome",
      blurb:
        "A niche favorite in “hidden gems” and Aventine walks.",
    },
    {
      id: "pyramid",
      name: "Pyramid of Cestius",
      lat: 41.8765,
      lng: 12.4808,
      aiScore: 73,
      category: "ancient",
      sampleQuery: "weird ancient monuments in Rome Testaccio",
      blurb:
        "Surfaces in offbeat and Testaccio/Ostiense itineraries.",
    },
    {
      id: "castel",
      name: "Castel Sant'Angelo",
      lat: 41.9031,
      lng: 12.4663,
      aiScore: 78,
      category: "vatican",
      sampleQuery: "things to do near the Vatican besides museums",
      blurb:
        "Appears in Vatican-adjacent and fortress-history itineraries, slightly less universal.",
    },
  ];

  var registry = {};
  var clusterGroup = null;
  var mapInstance = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isMobileMap() {
    return window.matchMedia(MOBILE_MQ).matches;
  }

  function getTier(score) {
    var s = Math.max(0, Math.min(100, Number(score) || 0));
    if (s >= 90) return "high";
    if (s >= 80) return "mid";
    return "emerging";
  }

  function markerFillColor(score) {
    var s = Math.max(0, Math.min(100, Number(score) || 0));
    var hue = 280 - s * 1.15;
    var light = 42 + s * 0.12;
    return "hsl(" + hue + ", 62%, " + light + "%)";
  }

  function tierIconSize(tier) {
    if (tier === "high") return { px: 36, className: "attractions-marker-icon--tier-high" };
    if (tier === "mid") return { px: 32, className: "attractions-marker-icon--tier-mid" };
    return { px: 28, className: "attractions-marker-icon--tier-emerging" };
  }

  function buildPopupHtml(item) {
    var score = Math.max(0, Math.min(100, item.aiScore));
    return (
      '<div class="attractions-popup-inner">' +
      '<p class="attractions-popup__title">' +
      escapeHtml(item.name) +
      "</p>" +
      '<div class="attractions-popup__score-row">' +
      '<span class="attractions-popup__badge">AI favorability · ' +
      score +
      "/100</span>" +
      '<div class="attractions-popup__bar" aria-hidden="true">' +
      '<div class="attractions-popup__bar-fill" style="width:' +
      score +
      '%"></div>' +
      "</div>" +
      "</div>" +
      '<p class="attractions-popup__query"><span class="attractions-popup__query-label">Example query</span>' +
      escapeHtml(item.sampleQuery) +
      "</p>" +
      '<p class="attractions-popup__blurb">' +
      escapeHtml(item.blurb) +
      "</p>" +
      "</div>"
    );
  }

  function buildDetailInnerHtml(item) {
    var score = Math.max(0, Math.min(100, item.aiScore));
    return (
      "<p><strong>" +
      escapeHtml(String(score)) +
      "/100</strong> AI favorability (demo)</p>" +
      "<p><strong>Example query:</strong> " +
      escapeHtml(item.sampleQuery) +
      "</p>" +
      "<p>" +
      escapeHtml(item.blurb) +
      "</p>"
    );
  }

  function createMarkerForItem(item) {
    var score = Math.max(0, Math.min(100, item.aiScore));
    var tier = getTier(score);
    var fill = markerFillColor(score);
    var sz = tierIconSize(tier);
    var html =
      '<span class="attractions-marker-icon ' +
      sz.className +
      '" style="background:' +
      fill +
      '">' +
      score +
      "</span>";

    var icon = L.divIcon({
      className: "attractions-marker-wrap",
      html: html,
      iconSize: [sz.px, sz.px],
      iconAnchor: [sz.px / 2, sz.px],
      popupAnchor: [0, -Math.round(sz.px * 0.85)],
    });

    var marker = L.marker(L.latLng(item.lat, item.lng), { icon: icon, title: item.name });

    if (!isMobileMap()) {
      marker.bindPopup(buildPopupHtml(item), {
        className: "attractions-popup",
        maxWidth: 320,
      });
    }

    marker.on("click", function () {
      if (!isMobileMap()) {
        marker.closePopup();
      }
      clusterGroup.zoomToShowLayer(marker, function () {
        if (isMobileMap()) {
          openDetailPanel(item);
        } else {
          marker.openPopup();
        }
      });
    });

    return marker;
  }

  function openDetailPanel(item) {
    var panel = document.getElementById("attractions-detail");
    var titleEl = document.getElementById("attractions-detail-title");
    var bodyEl = document.getElementById("attractions-detail-body");
    if (!panel || !titleEl || !bodyEl) return;
    titleEl.textContent = item.name;
    bodyEl.innerHTML = buildDetailInnerHtml(item);
    panel.hidden = false;
    panel.classList.add("attractions-detail--open");
  }

  function closeDetailPanel() {
    var panel = document.getElementById("attractions-detail");
    if (!panel) return;
    panel.classList.remove("attractions-detail--open");
    panel.hidden = true;
  }

  function fitAllBounds() {
    if (!mapInstance) return;
    var b = L.latLngBounds([]);
    ATTRACTIONS.forEach(function (a) {
      b.extend(L.latLng(a.lat, a.lng));
    });
    if (b.isValid()) {
      mapInstance.fitBounds(b, { padding: [48, 48], maxZoom: 14, animate: true });
    }
  }

  function addFitControl(map) {
    var Ctrl = L.Control.extend({
      onAdd: function () {
        var wrap = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        var btn = L.DomUtil.create("button", "attractions-fit-control", wrap);
        btn.type = "button";
        btn.title = "Zoom to show all places";
        btn.setAttribute("aria-label", "Fit all places on the map");
        btn.textContent = "Fit all";
        L.DomEvent.disableClickPropagation(wrap);
        L.DomEvent.on(btn, "click", function (e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          fitAllBounds();
        });
        return wrap;
      },
    });
    new Ctrl({ position: "topleft" }).addTo(map);
  }

  function rebuildMarkers() {
    if (!mapInstance || !clusterGroup) return;

    registry = {};
    clusterGroup.clearLayers();

    ATTRACTIONS.forEach(function (item) {
      var marker = createMarkerForItem(item);
      registry[item.id] = { marker: marker, item: item };
      clusterGroup.addLayer(marker);
    });
  }

  function initDetailClose() {
    var closeBtn = document.getElementById("attractions-detail-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeDetailPanel();
      });
    }
  }

  function initMap() {
    var el = document.getElementById("attractions-map");
    if (!el || typeof L === "undefined" || typeof L.markerClusterGroup !== "function") {
      return;
    }

    initDetailClose();

    mapInstance = L.map(el, {
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
        '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(mapInstance);

    clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 56,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 16,
    });
    mapInstance.addLayer(clusterGroup);

    addFitControl(mapInstance);

    rebuildMarkers();

    var b = L.latLngBounds([]);
    ATTRACTIONS.forEach(function (a) {
      b.extend(L.latLng(a.lat, a.lng));
    });
    if (b.isValid()) {
      mapInstance.fitBounds(b, { padding: [48, 48], maxZoom: 14 });
    } else {
      mapInstance.setView([41.9028, 12.4964], 12);
    }

    function refreshSize() {
      if (!mapInstance) return;
      mapInstance.invalidateSize({ animate: false });
    }

    window.requestAnimationFrame(refreshSize);
    window.addEventListener("resize", refreshSize);
    document.addEventListener("includes:ready", refreshSize);

    var mq = window.matchMedia(MOBILE_MQ);
    function onMqChange() {
      rebuildMarkers();
    }
    if (mq.addEventListener) {
      mq.addEventListener("change", onMqChange);
    } else if (mq.addListener) {
      mq.addListener(onMqChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMap);
  } else {
    initMap();
  }
})();
