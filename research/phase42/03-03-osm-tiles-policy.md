# OpenStreetMap tile policy and providers

OpenStreetMap data and OpenStreetMap’s public tile infrastructure are different things. The OSM Foundation (OSMF) says the data is free to copy, adapt, and use commercially under the Open Database License (ODbL), provided that OpenStreetMap and its contributors are credited and the license is made clear. The same guidance says OSM does not provide a free map API or third-party tile service; `tile.openstreetmap.org` is donation-funded and is not intended to be a commercial tile service. [2] [3]

## What the standard OSM tile policy requires

For the Standard/OSM Carto raster layer, the policy requires the exact HTTPS endpoint `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, visible map attribution, a stable and identifiable application `User-Agent`, and a valid browser `Referer` where applicable. A typical credit is “© OpenStreetMap contributors” linked to the copyright page. Attribution must not be hidden behind a control, below the viewport, or off-screen. [1] The OSM copyright guidance additionally says the credit should make clear that the data is available under ODbL; linking to the copyright page is the normal web implementation. [2]

Clients must honor the server’s `Cache-Control`, `Expires`, and `ETag` headers; where a cache cannot read them, the policy requires at least seven days of tile caching. Clients should use conditional requests after expiry and must not send default `Cache-Control: no-cache`, `Pragma: no-cache`, or equivalent cache-bypassing headers. The policy generally discourages a customer caching proxy; if one is used, it must identify a contactable operator and honor the same cache rules. [1]

The endpoint is for tiles needed by a person’s current interactive view, with only modest browser-like look-ahead. Bulk downloading, systematic scraping, wide-area/high-zoom scans, pre-seeding, tile archives, headless panning, and “download for offline” features are prohibited. OSMF states that offline use is not permitted on this endpoint and recommends self-hosting or a provider that expressly permits offline/prefetch use. [1] A valid identity is operationally important: generic library user-agents, anonymous proxies, spoofing, or stripping the `Referer` may be blocked. [1]

Availability is explicitly best-effort, with no SLA or guarantee. OSMF may block access without notice if usage harms service, and its policy warns commercial services that access may be withdrawn, potentially leaving them unable to serve paying customers. [1] This is the decisive distinction for Eagle Eye: opt-in demo tiles can be a low-volume demonstration path, but the public endpoint must not be treated as commercial-scale production infrastructure.

## Practical alternatives and trade-offs

**MapTiler Cloud (commercial hosted option).** MapTiler provides documented raster/vector tile APIs and TileJSON, suitable for browser and native integrations. [6] Its Cloud terms limit the free plan to non-commercial use and commercial-product R&D; production use belongs on a subscription/custom plan. End-user device caching is allowed, but server-side proxy/cache, export outside the service, and bulk tile downloading require agreement or are prohibited. [4] MapTiler’s required visible credit is “© MapTiler © OpenStreetMap contributors”; its maps also derive from OpenMapTiles, whose credit requirement is addressed by MapTiler’s permission to use its own credit. [5] **Product judgment:** this is a straightforward production candidate when Eagle Eye wants managed scale, but the selected plan and any proxy/offline requirement must be checked against the current contract.

**Stadia Maps (commercial hosted option).** Stadia’s documentation requires prominent attribution conveying Stadia Maps, OpenMapTiles, and OpenStreetMap, normally with links. [7] Its terms prohibit commercial use without an active paid subscription, prohibit server-side caching except specified cases, and allow standard local client caching only for the HTTP cache lifetime (or seven days if no header is returned). The terms also permit a limited mobile offline cache up to 100 MB per device and prohibit bulk downloading beyond that exception. [8] **Product judgment:** Stadia is suitable for a paid, interactive application and offers a clearer bounded mobile-offline exception than OSMF’s public endpoint, but Eagle Eye should model quota and attribution behavior before committing.

**OSM US Tileservice or self-hosting.** OSM US offers vector/raster tiles and fonts, but its policy makes the free service non-commercial/low-volume: revenue-generating use requires written permission, access tiers are limited, and availability/performance are not guaranteed. [9] It is therefore a partnership route, not an assumed commercial fallback. OSMF explicitly says users can take OSM data and deploy their own tile service. [3] **Product judgment:** self-hosting gives the most control over SLA, styling, caching, and offline packaging, but shifts import, rendering, storage, monitoring, and update operations to Eagle Eye.

## Recommended Eagle Eye posture

Keep OSMF tiles behind an explicit “OSM demo” opt-in, with visible attribution, compliant caching, stable identification, and no prefetch/offline controls. Make the tile provider configurable rather than hard-coded, instrument tile error/rate-limit/latency metrics, and provide a production adapter for a paid provider or Eagle Eye-hosted tiles. Treat attribution as a persistent map UI element and retain provider-specific credits (including OpenMapTiles where required). Before production launch, choose a provider whose written terms match expected traffic, proxy architecture, caching, and offline requirements; do not promise availability based on `tile.openstreetmap.org`.

## References

[1]: https://operations.osmfoundation.org/policies/tiles/ "Tile Usage Policy — OpenStreetMap Foundation Operations"
[2]: https://www.openstreetmap.org/copyright/attribution-guide/ "Copyright and License — OpenStreetMap Attribution Guide"
[3]: https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ "Licence and Legal FAQ — OpenStreetMap Foundation"
[4]: https://www.maptiler.com/terms/cloud/ "MapTiler Cloud Terms and Conditions"
[5]: https://www.maptiler.com/copyright/ "MapTiler map data licenses"
[6]: https://docs.maptiler.com/cloud/api/tiles/ "Tiles API — MapTiler API"
[7]: https://docs.stadiamaps.com/attribution/ "Legally Required Attribution — Stadia Maps"
[8]: https://stadiamaps.com/terms-of-service/ "Stadia Maps Terms of Service"
[9]: https://tiles.openstreetmap.us/usage-policy/ "OpenStreetMap US Tileservice Usage Policy"
