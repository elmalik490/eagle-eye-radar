# الأداء التدريجي لتطبيق ثابت وخريطة

## Evidence note

For a static GitHub Pages map, the lowest-cost performance strategy is **progressive disclosure**: paint a small, stable HTML/CSS shell first, then load map code and data only when they are needed. This is a product judgment based on Chrome’s advice to avoid unnecessary JavaScript, use code splitting, and keep startup work small [1]. Do not make the initial screen wait for the mapping library, a large marker dataset, or decorative map animation. A lightweight map placeholder with a fixed height can be the first useful paint; initialize the interactive map after the shell is visible or when the map section is near the viewport. This is preferable to adding WebGL or another rendering layer solely for visual polish.

The measurable target is the current Core Web Vitals set: **LCP ≤ 2.5 seconds, INP ≤ 200 ms, and CLS ≤ 0.1 at the 75th percentile**, segmented by mobile and desktop [2]. LCP is especially sensitive to client-side discovery delays. Chrome reports that many poor-LCP pages delay discovering their image LCP resource, and recommends making the important resource discoverable from HTML rather than waiting for JavaScript [1]. Therefore, keep the initial shell’s critical CSS and any true above-the-fold image discoverable in the HTML. Conversely, do not lazy-load content that is visible in the first viewport, especially the LCP element [3]. For map tiles and map JavaScript, the product judgment is to defer them until map intent is clear, while keeping the placeholder immediately visible; validate that this improves LCP rather than merely moving the delay into the first interaction.

**Dependency budget:** use native browser behavior before adding a library. Chrome’s image guidance says browser-level `loading="lazy"` avoids custom lazy-loading code and a separate JavaScript library, while off-screen images should have explicit dimensions to reserve space [3]. For the app, apply the analogous budget rule: ship only the map features required for first use, split search, export, analytics, and rarely used controls into later chunks, and inspect Chrome DevTools Coverage for unused code [1]. Keep marker data compact and avoid shipping full descriptions or geometry for every point in the initial bundle; fetch or reveal detail on selection if the product permits (product judgment, supported by the startup/code-splitting guidance in [1]).

**Marker efficiency:** Google’s Maps documentation says optimized markers can render many markers as a single static element, and that the API attempts optimization for large numbers; separate DOM rendering is needed when each marker must be independently accessible or interactive [4]. Google’s clustering tutorial combines nearby markers into clusters, which change as the user zooms, reducing visual overload and the number of individual markers shown at low zoom [5]. The low-cost recommendation is to cluster at overview zooms, use one simple SVG/PNG style, avoid animated GIF/PNG markers and per-marker custom HTML unless needed, and render detailed popovers only for the selected point. Advanced markers provide customizable HTML/CSS and accessible click/keyboard interaction [6], but custom HTML for every point is a product tradeoff—not a reason to adopt a heavier stack by default.

**Layout stability and motion:** CLS captures unexpected movement, commonly caused by asynchronously loaded content, unknown image/video dimensions, fonts, or widgets [7]. Reserve the map’s dimensions with CSS (`aspect-ratio` or a fixed/minimum height), reserve space for the result panel and loading state, and do not insert controls above content after first paint. Chrome recommends explicit image dimensions and says user-triggered loading should create space immediately with a loading indicator [3] [7]. For pan/zoom transitions, prefer short, purposeful motion; use `transform` rather than changing layout properties where possible [7]. Honor `prefers-reduced-motion: reduce`: web.dev describes it as the OS preference for minimizing motion and shows disabling decorative animation, including conditionally omitting animation CSS [8]. In practice, disable fly-to, marker bounce, pulsing location rings, and nonessential transitions for that preference.

**Slow-network validation:** Chrome DevTools can calibrate CPU throttling for low- and mid-tier mobile devices and define custom network profiles with download/upload speed, latency, packet loss, and reordering [9]. Test a cold cache on a throttled mobile CPU/network, then measure LCP, INP, and CLS in DevTools or PageSpeed Insights; use CrUX or real-user monitoring when traffic exists [2]. A practical release gate is: shell visible without the map library, no major layout jump when the map initializes, map interaction remains responsive after the first tap, and marker counts do not create long main-thread tasks. Chrome defines tasks over 50 ms as long tasks that can block input, and recommends yielding and avoiding large rendering updates [1].

### Prioritized low-cost changes

1. Reserve map and panel geometry before asynchronous work.
2. Keep critical shell CSS/HTML small; code-split map-adjacent features and remove unused JavaScript.
3. Defer map initialization/data until viewport proximity or explicit map intent; never defer the true above-the-fold LCP resource.
4. Cluster markers, use optimized/simple icons, and avoid per-marker DOM/animation by default.
5. Add reduced-motion CSS/JS behavior and remove decorative map motion.
6. Re-test cold-cache performance with calibrated mobile CPU and slow-network profiles, then monitor field CWV.

## References

[1]: https://web.dev/articles/top-cwv "The most effective ways to improve Core Web Vitals" — web.dev / Chrome team.
[2]: https://web.dev/articles/vitals "Web Vitals" — web.dev / Chrome team.
[3]: https://web.dev/articles/browser-level-image-lazy-loading "Browser-level image lazy loading for the web" — web.dev.
[4]: https://developers.google.com/maps/documentation/javascript/markers "Markers (Legacy)" — Google Maps Platform documentation.
[5]: https://developers.google.com/maps/documentation/javascript/marker-clustering "Marker Clustering" — Google Maps Platform documentation.
[6]: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview "Markers overview" — Google Maps Platform documentation.
[7]: https://web.dev/articles/cls "Cumulative Layout Shift (CLS)" — web.dev.
[8]: https://web.dev/articles/prefers-reduced-motion "prefers-reduced-motion: Sometimes less movement is more" — web.dev.
[9]: https://developer.chrome.com/docs/devtools/settings/throttling "Throttling" — Chrome for Developers.
