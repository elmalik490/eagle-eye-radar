# Phase 4.2 synthesis — Eagle Eye Radar

## Executive summary

The research converges on a **small, map-led, evidence-aware static prototype**, not a platform rebuild. The next release should make the demo’s scope, synthetic status, evidence state, source, time window, coverage, and limitations impossible to miss; provide a simple map/list/detail flow; and measure usability, accessibility, and performance before adding richer geographic rendering. Keep Leaflet and the current static architecture unless measured requirements demand vector tiles, data-driven styling, 3D, or a tile backend. Treat every alert as a signal requiring validation—not proof of an event, loss, wrongdoing, or demand.

**Immediate static-prototype changes** are recommendations 1–4. **Future infrastructure or scale-triggered work** is recommendations 5–7. No new item-level research was conducted; this synthesis uses only the completed Phase 4.2 findings and their verified URLs.

## Ranked recommendations

### 1. Make the synthetic/evidence boundary a first-class product surface — **Immediate**

**Value: Very high | Effort: Low–medium | Risk: Low**

Add a persistent `DEMO / SYNTHETIC` label and a contract-before-motion message: fixed-duration, non-live, no personal data, no verified losses, forecasts, or outbound actions. Give every record an evidence-state badge: **OBSERVED, REPORTED, DERIVED, SYNTHETIC, UNRESOLVED, or VERIFIED**. For the current demo, synthetic records must be excluded from default observed-event counts and shown in a separate simulation layer/legend. Replace “confirm” with **Open source and verify**; expose method, timestamp, source (or “none”), precision, and limitations.

This is the highest-leverage trust improvement: provenance and signatures can show history or tamper evidence but do not prove truth; synthetic geographic data must not be presented as an observed location; deterministic rule matches remain repeatable signals, not independent corroboration. [C2PA](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html), [W3C PROV](https://www.w3.org/TR/prov-overview/), [NIST AI RMF](https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf), [ONS synthetic data policy](https://www.ons.gov.uk/aboutus/transparencyandgovernance/datastrategy/datapolicies/syntheticdatapolicy), [UK Statistics Authority](https://uksa.statisticsauthority.gov.uk/publications/ethical-considerations-relating-to-the-creation-and-use-of-synthetic-data/pages/5/).

### 2. Ship a minimal map-first browse → inspect → compare flow with a synchronized list — **Immediate**

**Value: Very high | Effort: Medium | Risk: Low–medium**

Keep one restrained world view, one primary overlay, visible title/date window/legend/source-coverage note, and reset. Use the current nine-record fixture as individual selectable markers plus a synchronized list/count; add a medium preview panel with location, timestamp, source, evidence state, confidence/coverage, and plain-language interpretation. Selecting a marker selects the same item in the list and vice versa. Allow one bounded comparison at a time; put advanced layers, animation, tilt, and unrestricted exploration outside the default.

This preserves spatial orientation while supplying a faster, keyboard- and touch-friendly alternative to dense or ambiguous pins. Research supports overview → zoom/filter → details-on-demand, but also warns that interaction freedom and map complexity increase learning cost. [Map-learning/cognitive load](https://www.mdpi.com/2220-9964/9/7/429), [interactive-cartography review](https://www.tandfonline.com/doi/full/10.1080/23729333.2017.1288534), [dashboard information-seeking mantra](https://data.europa.eu/apps/data-visualisation-guide/the-information-seeking-mantra), [mobile maps usability](https://www.nngroup.com/articles/mobile-maps-locations/), [mobile point-feature study](https://www.tandfonline.com/doi/abs/10.1080/00087041.2023.2182354).

### 3. Rebuild the landing canvas as a scan-first dashboard with explicit scope — **Immediate**

**Value: High | Effort: Low–medium | Risk: Low**

Do not invent KPIs. Put only approved Eagle Eye summaries/states in the first band; otherwise show an approved view with explicit scope and data currency. Keep the landing view within a small view budget: overview first, primary pattern/comparison next, context and exceptions after, record-level evidence only after selection. Show active filters, time window, geography, coverage, update status, and reset/undo. Preserve overview context during highlight/zoom and use position/length for comparisons; use restrained color only for category or emphasis, never as the sole meaning.

This follows convergent Tableau, Power BI, Shneiderman, NN/g, and systematic-review guidance: dashboards are overviews, not a pile of detail tiles; more filters and views increase ambiguity and cognitive load. [Tableau dashboard guidance](https://help.tableau.com/current/pro/desktop/en-us/dashboards_best_practices.htm), [Power BI dashboard guidance](https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips), [NN/g dashboards](https://www.nngroup.com/articles/dashboards-preattentive/), [systematic dashboard usability review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9977530/).

### 4. Make accessibility and performance acceptance criteria, not post-launch polish — **Immediate**

**Value: High | Effort: Medium | Risk: Low**

Provide skip-to-map and skip-to-data links, a complete HTML list/table fallback, descriptive unique marker names, visible focus, native controls, keyboard zoom/pan/selection, popup focus restoration, and non-color cues. Offer button-based alternatives to drag/pinch and honor `prefers-reduced-motion`/library motion settings. Reserve map and panel geometry before asynchronous initialization; initialize noncritical map work on explicit intent or viewport proximity; use simple/optimized markers and no decorative motion.

Create a test gate covering keyboard-only navigation, screen readers, dense pins, one-handed mobile use, slow network, low/mid-tier devices, and color-disabled views. Track task completion, find time, selection errors, map first-use responsiveness, LCP, INP, and CLS; use the cited Core Web Vitals thresholds as targets rather than claims of current performance. [WCAG keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html), [Minnesota interactive-map guide](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [WCAG non-text contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html), [web.dev vitals](https://web.dev/articles/vitals), [web.dev CLS](https://web.dev/articles/cls).

### 5. Keep Leaflet and make the tile provider replaceable; do not migrate for novelty — **Future/scale-triggered**

**Value: Medium–high | Effort: Low now, high if migrated | Risk: Low now, medium–high on migration**

Freeze a known Leaflet version, keep the current interaction model, and measure transfer/decompression, first draw, pan/zoom FPS, memory, WebGL failure rate, feature count, tile requests, and error/429/latency behavior on representative phones. Abstract the provider URL/configuration and persist required attribution. Use OSMF public tiles only in an explicit low-volume opt-in/demo path with exact HTTPS endpoint, attribution, identifiable User-Agent/Referer, compliant caching, and no prefetch/offline controls. Before commercial launch, contract a paid provider or self-hosted stack whose terms match proxying, caching, traffic, and offline needs.

Move to MapLibre only if measured budgets fail or vector tiles/data-driven styling/3D become real requirements; then prototype a constrained path with WebGL fallback and an accessible HTML list. Leaflet’s smaller/simple raster/GeoJSON path is sufficient for the current fixture; MapLibre adds WebGL, vector-tile, style/layer, worker, and fallback complexity. [Leaflet](https://leafletjs.com/), [MapLibre introduction](https://www.maplibre.org/maplibre-gl-js/docs/), [MapLibre large-data guidance](https://maplibre.org/maplibre-gl-js/docs/guides/large-data/), [OSMF tile policy](https://operations.osmfoundation.org/policies/tiles/), [MapTiler terms](https://www.maptiler.com/terms/cloud/), [Stadia terms](https://stadiamaps.com/terms-of-service/).

### 6. Add scale-aware aggregation only when the fixture or product requires it — **Future/scale-triggered**

**Value: Medium | Effort: Medium–high | Risk: Medium**

Do not add a heatmap or choropleth to the nine-record demo for visual effect. Build a deterministic test fixture before changing representation: sparse global outliers, coincident urban points, regional clusters, optional magnitude, and explicit uncertainty. Label every mode as **raw record, cluster count, density, or country rate**. At world scale use count-bearing clusters or administrative bins; at dense medium scales use cluster expansion or an optional heatmap; at high zoom reveal individual records. Keep uncertainty type/value inspectable and distinct from confidence in truth.

Clusters preserve countable overview but hide identities until expansion; heatmaps imply continuous relative density and are unsuitable for few points; choropleths describe normalized administrative values, not observations. [ArcGIS high-density guidance](https://doc.arcgis.com/en/arcgis-online/reference/best-practices-high-density-data.htm), [ArcGIS clustering](https://doc.arcgis.com/en/arcgis-online/create-maps/configure-clustering-mv.htm), [Mapbox clusters](https://docs.mapbox.com/mapbox-gl-js/example/cluster/), [Mapbox heatmaps](https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/), [European Data Portal choropleths](https://data.europa.eu/apps/data-visualisation-guide/choropleth-maps), [uncertainty decision study](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2020.00032/full).

### 7. Treat revenue leakage as a validated evidence-and-controls workflow, not a predictive KPI — **Future infrastructure**

**Value: High for commercial operations | Effort: High | Risk: High if over-claimed**

Only pursue this after immutable IDs and timestamps can join inbound request, assignment, response, qualification, quote, completion, invoice, payment, refund, credit, and write-off events. Show evidence cards with raw record links, stage, reason code, denominator, baseline, confidence scope, and amount formula. Route each candidate through dispositions such as confirmed leak, valid exception, duplicate/spam, non-consent, customer delay, capacity/no-fit, contractual exclusion, or insufficient evidence. Separate amount at risk, expected value, confirmed cash recovered, and net incremental margin; require human approval for discounts, refunds, contract changes, collections escalation, and revenue recognition.

Missing data is a suspected exception, not proof of lost revenue. Baseline each customer/channel/cohort rather than importing unsupported market-loss or conversion claims. [Stripe revenue recovery](https://stripe.com/resources/more/revenue-recovery-101), [SEC SAB Topic 13](https://www.sec.gov/interps/account/sabcodet13.htm), [GFOA revenue control policy](https://www.gfoa.org/materials/revenue-control-policy), [Stripe recovery analytics](https://docs.stripe.com/billing/revenue-recovery/recovery-analytics), [IIA continuous auditing](https://www.theiia.org/globalassets/documents/content/articles/guidance/gtag/gtag-3-continuous-auditing/gtag-3-continuous-auditing-2nd-edition.pdf), [COSO](https://www.coso.org/guidance-on-ic).

## Principles to hold across the build

- **Signal is not proof.** Confidence describes a rule match, coverage, or uncertainty dimension—not truth of an event.
- **Synthetic is not observed.** Keep synthetic layers, counts, labels, exports, and demo flows separate from real evidence.
- **Overview before complexity.** One primary overlay, bounded comparison, progressive disclosure, and a synchronized list beat a control-heavy default.
- **Every important map fact needs a non-map route.** Keyboard, screen-reader, touch, and list/table equivalents are part of the product.
- **Scope is part of the data.** Always show geography, time window, denominator, source, method, freshness, coverage, license, and limitations.
- **Measure before migrating or scaling.** Use task, performance, accessibility, and error measurements rather than novelty or vendor capability.
- **Finite, honest exploration.** Use pre-authored examples and calm completion states; never use fake urgency, “AI detected” theatre, fake social proof, or addictive reveal loops. [FTC dark-pattern report](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800+Dark+Patterns+Report+9.14.2022+-+FINAL.pdf), [OECD dark commercial patterns](https://www.oecd.org/en/topics/sub-issues/dark-commercial-patterns.html), [EU Digital Services Act recital 67](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2065).

## Avoid for now

- Migrating Leaflet to MapLibre solely because it is newer.
- Heatmaps, choropleths, 3D, tilt, animation, unrestricted multi-layer controls, or thousands of custom DOM markers without a measured use case.
- OSMF public tiles as a commercial SLA, bulk/offline source, or hard-coded production dependency.
- Unapproved business KPIs, inferred company losses, market conversion claims, or “verified” labels derived from deterministic rules.
- Product/Review/Rating/Offer structured data for synthetic scenarios; truthful SEO metadata can wait until the public URL and preview asset are final. [Google structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).
- Fake scan timers, scarcity, social proof, unexplained confidence, “you almost found it,” or forced continuation.

## Unavailable or failed research topics

No failures were reported in the supplied Phase 4.2 results. No additional item-level research was conducted for this synthesis. The recommendations remain bounded by the supplied evidence: there is no application-specific performance benchmark, live commercial data validation, production tile contract, completed assistive-technology audit, or deployed-URL SEO measurement in the provided findings.

## Source note

The evidence set comprises the verified URLs cited inline above, drawn from the 13 completed Phase 4.2 reports: map UX and cognitive load; Leaflet/MapLibre; OSM tile policy; global signal visualization; dashboard IA; revenue leakage; mobile map interaction; accessible maps; static-map performance; synthetic-data trust/provenance; static SEO; healthy exploration; and global product patterns.
