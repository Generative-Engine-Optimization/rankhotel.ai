/**
 * Cal.com element-click embed — opens booking UI on elements with data-cal-* attributes.
 * Configure CTAs in index.html: data-cal-link, data-cal-namespace, data-cal-config.
 */
(function () {
  var EMBED_SCRIPT = "https://app.cal.com/embed/embed.js";
  var INIT = "init";
  var NAMESPACE = "rankhotel.ai";
  var ORIGIN = "https://app.cal.com";

  (function (C, A, L) {
    var p = function (a, ar) {
      a.q.push(ar);
    };
    var d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        var cal = C.Cal;
        var ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () {
            p(api, arguments);
          };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, EMBED_SCRIPT, INIT);

  Cal("init", NAMESPACE, { origin: ORIGIN });
  Cal.ns[NAMESPACE]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
  });
})();
