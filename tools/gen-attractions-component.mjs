/**
 * One-off generator: reads assets/js/embeds/attractions-map.js and writes
 * attractions-map-component.html (embeddable fragment).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

let js = fs.readFileSync(path.join(root, "assets/js/embeds/attractions-map.js"), "utf8");
js = js.replace(/\r?\n\s*document\.addEventListener\("includes:ready", refreshSize\);\r?\n/, "\n");

const idReplacements = [
  ["attractions-detail-close", "rh-ae-detail-close"],
  ["attractions-detail-title", "rh-ae-detail-title"],
  ["attractions-detail-body", "rh-ae-detail-body"],
  ["attractions-detail", "rh-ae-detail"],
  ["attractions-map", "rh-ae-map"],
];
for (const [a, b] of idReplacements) {
  js = js.split(a).join(b);
}

// attractions-popup-inner becomes rh-ae-popup-inner via global replace below
js = js.replace(/attractions-popup/g, "rh-ae-popup");
js = js.replace(/attractions-fit-control/g, "rh-ae-fit-control");
js = js.replace(/attractions-marker-wrap/g, "rh-ae-marker-wrap");
js = js.replace(/attractions-marker-icon/g, "rh-ae-marker-icon");

const css = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
@import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
@import url("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
@import url("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");

.rh-ae {
  --rh-ae-surface: #121212;
  --rh-ae-on: #e5e2e1;
  --rh-ae-muted: #cac4c0;
  --rh-ae-primary: #9c7dd8;
  --rh-ae-tertiary: #7dd8c4;
  box-sizing: border-box;
  font-family: Inter, system-ui, sans-serif;
  color: var(--rh-ae-on);
  width: 100%;
  max-width: 100%;
  position: relative;
}
.rh-ae *,
.rh-ae *::before,
.rh-ae *::after {
  box-sizing: border-box;
}

.rh-ae .rh-ae-map-wrap {
  width: 100%;
  max-width: 100%;
  min-height: min(58vh, 36rem);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--rh-ae-surface);
}
@media (min-width: 768px) {
  .rh-ae .rh-ae-map-wrap {
    min-height: min(72vh, 56rem);
  }
}
.rh-ae .rh-ae-map-wrap .leaflet-container {
  font-family: Inter, system-ui, sans-serif;
  background: #0a0a0a;
}
.rh-ae .rh-ae-map-wrap .leaflet-control-attribution {
  background: rgba(10, 10, 10, 0.85);
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.6875rem;
}
.rh-ae .rh-ae-map-wrap .leaflet-control-attribution a {
  color: rgba(212, 180, 255, 0.9);
}

.rh-ae .rh-ae-map-wrap .marker-cluster-small,
.rh-ae .rh-ae-map-wrap .marker-cluster-medium,
.rh-ae .rh-ae-map-wrap .marker-cluster-large {
  background: rgba(30, 30, 30, 0.92);
  border: 2px solid rgba(212, 180, 255, 0.35);
}
.rh-ae .rh-ae-map-wrap .marker-cluster-small div,
.rh-ae .rh-ae-map-wrap .marker-cluster-medium div,
.rh-ae .rh-ae-map-wrap .marker-cluster-large div {
  background: rgba(212, 180, 255, 0.22);
  color: #f5f2ff;
  font-weight: 700;
  font-size: 0.75rem;
}

.rh-ae-fit-control {
  background: rgba(20, 20, 20, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 0.5rem !important;
  color: var(--rh-ae-on);
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.5rem !important;
  cursor: pointer;
  line-height: 1.2;
}
.rh-ae-fit-control:hover {
  background: rgba(40, 40, 40, 0.95);
}

.leaflet-popup.rh-ae-popup .leaflet-popup-content-wrapper,
.rh-ae-popup .leaflet-popup-content-wrapper {
  background: #2a2a2a;
  color: var(--rh-ae-on);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
}
.leaflet-popup.rh-ae-popup .leaflet-popup-tip,
.rh-ae-popup .leaflet-popup-tip {
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.rh-ae-popup .leaflet-popup-content {
  margin: 0.75rem 1rem;
  min-width: 14rem;
  max-width: min(20rem, 85vw);
}
.rh-ae-popup__title {
  font-weight: 700;
  font-size: 1rem;
  margin: 0 0 0.5rem;
  line-height: 1.25;
  color: var(--rh-ae-on);
}
.rh-ae-popup__score-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.rh-ae-popup__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(212, 180, 255, 0.15);
  color: #e8deff;
}
.rh-ae-popup__bar {
  flex: 1;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.rh-ae-popup__bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--rh-ae-primary), var(--rh-ae-tertiary));
}
.rh-ae-popup__query {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  line-height: 1.4;
  font-style: italic;
  color: rgba(255, 255, 255, 0.55);
}
.rh-ae-popup__query-label {
  font-style: normal;
  font-weight: 600;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.4);
  display: block;
  margin-bottom: 0.2rem;
}
.rh-ae-popup__blurb {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--rh-ae-muted);
}
.rh-ae-marker-wrap {
  background: transparent !important;
  border: none !important;
}
.rh-ae-marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 800;
  color: #0a0a0a;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.rh-ae-marker-icon--tier-high {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 0.6875rem;
  border-width: 3px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(212, 180, 255, 0.2);
}
.rh-ae-marker-icon--tier-mid {
  width: 2rem;
  height: 2rem;
  font-size: 0.6875rem;
  border-width: 2px;
}
.rh-ae-marker-icon--tier-emerging {
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.625rem;
  border-width: 2px;
}

.rh-ae .rh-ae-detail {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0));
  background: linear-gradient(to top, rgba(10, 10, 10, 0.98), rgba(18, 18, 18, 0.96));
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
  transform: translateY(110%);
  opacity: 0;
  visibility: hidden;
  transition: transform 0.28s ease, opacity 0.28s ease, visibility 0.28s;
}
.rh-ae .rh-ae-detail.rh-ae-detail--open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}
@media (prefers-reduced-motion: reduce) {
  .rh-ae .rh-ae-detail {
    transition: none;
  }
}
@media (min-width: 768px) {
  .rh-ae .rh-ae-detail {
    display: none !important;
  }
}
.rh-ae-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.rh-ae-detail__title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--rh-ae-on);
  line-height: 1.25;
}
.rh-ae-detail__close {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: var(--rh-ae-on);
  cursor: pointer;
  font: inherit;
  font-size: 1.25rem;
  line-height: 1;
}
.rh-ae-detail__body {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--rh-ae-muted);
  max-height: min(40vh, 16rem);
  overflow-y: auto;
}
.rh-ae-detail__body p {
  margin: 0 0 0.5rem;
}
.rh-ae-detail__body p:last-child {
  margin-bottom: 0;
}
`.trim();

const html = `<div class="rh-ae" data-rh-rome-attractions-embed>
  <style>${css}</style>
  <div
    id="rh-ae-map"
    class="rh-ae-map-wrap"
    role="application"
    aria-label="Interactive map of Rome attractions"
  ></div>
  <div
    id="rh-ae-detail"
    class="rh-ae-detail"
    role="region"
    aria-label="Selected attraction details"
    aria-live="polite"
    hidden
  >
    <div class="rh-ae-detail__header">
      <h2 class="rh-ae-detail__title" id="rh-ae-detail-title"></h2>
      <button type="button" class="rh-ae-detail__close" id="rh-ae-detail-close" aria-label="Close details">×</button>
    </div>
    <div class="rh-ae-detail__body" id="rh-ae-detail-body"></div>
  </div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" crossorigin=""></script>
  <script>
${js}
  </script>
</div>
`;

const banner = `<!--
  RankHotel.ai — Rome attractions map (embeddable component)
  Paste this entire block into any page (CMS, static HTML, etc.).
  All assets load from CDNs; script is inlined. One embed per page (fixed IDs).
  Requires HTTPS page for best CDN behavior; needs network for tiles & unpkg.
-->
`;

fs.writeFileSync(path.join(root, "attractions-map-component.html"), banner + html.trim() + "\n");
console.log("Wrote attractions-map-component.html");
