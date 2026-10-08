# أساسيات SEO لواجهة GitHub Pages ثابتة

**Scope:** Evidence-based recommendations for the existing Eagle Eye Radar one-page static demo. Sourced facts are cited inline; product judgments are labeled as such.

## What the current page already gets right

`index.html` already has a doctype, UTF-8, a viewport declaration, a `lang` value, one visible `h1`, and landmarks such as `header`, `nav`, `main`, `section`, and `footer`. MDN describes semantic HTML as machine-readable meaning that helps accessibility and search-engine optimization, and recommends meaningful landmarks and logical heading levels rather than presentational containers ([MDN, “Semantic HTML”](https://developer.mozilla.org/en-US/curriculum/core/semantic-html/)). **Product judgment:** keep this structure, but make the first visible heading and the `<title>` describe the same truthful concept. Keep the visible “DEMO / SYNTHETIC” and “UNVERIFIED” boundaries in initial HTML.

## High-value head and content fixes

Google recommends a descriptive, concise `<title>`, warns against repeated phrases and keyword stuffing, and may build a title link from the title, visible heading, `og:title`, page text, and anchors ([Google, “Influencing your title links”](https://developers.google.com/search/docs/appearance/title-link)). The current `Eagle Eye · Opportunity Intelligence` is a reasonable starting point, but **product judgment** is to make it more explicit and honest, for example: `Eagle Eye Radar | Synthetic opportunity-intelligence demo`. Use “opportunity intelligence” once, not a list of related keywords. Google does not use the `meta keywords` tag for indexing or ranking ([Google, “meta tags and attributes that Google supports”](https://developers.google.com/search/docs/crawling-indexing/special-tags)).

The existing description (“synthetic demo only”) is safe but underspecified. Google primarily generates snippets from page content and sometimes uses `meta[name=description]`; it recommends a unique, relevant, human-readable summary and says keyword strings are less likely to be used ([Google, “Control your snippets”](https://developers.google.com/search/docs/appearance/snippet)). **Product judgment:** replace it with: “Eagle Eye Radar is a static prototype for reviewing synthetic opportunity scenarios; no live business data, verified losses, forecasts, or outbound actions are connected.” Do not claim detection, revenue recovery, real-time signals, or verified businesses without evidence.

## URL identity, crawling, and a one-page sitemap

Add an absolute, self-referential `<link rel="canonical">` only after the public URL is decided. Google recommends absolute canonical URLs, consistent internal links, and a self-canonical; it says a sitemap is a weaker signal and robots.txt must not be used for canonicalization ([Google, “Consolidate duplicate URLs”](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)). GitHub Pages supports a default `github.io` host or custom domain ([GitHub Docs, “Configuring a custom domain for your GitHub Pages site”](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)); **product judgment:** choose one HTTPS host and reuse it in `canonical`, `og:url`, and the sitemap.

For an intended-public demo, place a root `robots.txt` with `User-agent: *`, `Allow: /`, and a full `Sitemap:` URL. RFC 9309 defines robots.txt as crawler-access rules and explicitly says they are not access authorization ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)); Google also warns that blocking crawling can leave a URL indexed without page content, so do not disallow the page if you need `noindex` or canonical signals read ([Google, “Robots meta tag”](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)). If the demo is not meant to appear in search, use `noindex` instead and do not rely on robots.txt. Google says a small, well-linked site may not need a sitemap, but a new site with few external links can benefit from one ([Google, “Learn about sitemaps”](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)); for this single URL, a one-entry sitemap is optional but inexpensive. The sitemap protocol requires absolute URLs from the same host and permits its location to be declared in robots.txt ([Sitemaps.org, “Sitemaps XML format”](https://www.sitemaps.org/protocol.html)).

## Social previews, performance, and structured-data boundaries

Open Graph’s four required properties are `og:title`, `og:type`, `og:image`, and `og:url`; `og:description` and `og:site_name` are recommended ([The Open Graph protocol](https://ogp.me/)). Add them only when `og:url` is final and a stable, publicly served preview image exists. **Product judgment:** do not invent an image or use a transient map screenshot; the current emoji mark is not a tested social asset. Keep `og:description` aligned with the synthetic-demo boundary.

Google’s page-experience guidance recommends secure delivery, mobile usability, good Core Web Vitals, and avoiding intrusive interstitials, while cautioning that good scores do not guarantee top rankings ([Google, “Understanding page experience”](https://developers.google.com/search/docs/appearance/page-experience)). Web.dev’s current targets are LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile ([Web Vitals](https://web.dev/articles/vitals)). **Product judgment:** retain the existing “load interactive map” opt-in, measure the deployed page, and prioritize CSS/JS weight, stable layout dimensions, and HTTPS assets.

Structured data is optional. Google recommends JSON-LD, but requires markup to describe visible, accurate content; it improves eligibility, not guarantees a rich result ([Google, “Introduction to structured data markup”](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)). **Product judgment:** do not mark synthetic scenarios as `Product`, reviews, ratings, prices, or real-world observations. Use `WebSite`/organization markup only when the named entity and facts are visibly present; otherwise semantic HTML is safer.

## References

[1]: https://developer.mozilla.org/en-US/curriculum/core/semantic-html/ "Semantic HTML — MDN Web Docs"
[2]: https://developers.google.com/search/docs/appearance/title-link "Influencing your title links in Google Search — Google Search Central"
[3]: https://developers.google.com/search/docs/crawling-indexing/special-tags "Meta tags and attributes that Google supports — Google Search Central"
[4]: https://developers.google.com/search/docs/appearance/snippet "Control your snippets in search results — Google Search Central"
[5]: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls "Consolidate duplicate URLs — Google Search Central"
[6]: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site "Configuring a custom domain for your GitHub Pages site — GitHub Docs"
[7]: https://www.rfc-editor.org/rfc/rfc9309.html "RFC 9309: Robots Exclusion Protocol — IETF"
[8]: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag "Robots meta tag and X-Robots-Tag — Google Search Central"
[9]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview "Learn about sitemaps — Google Search Central"
[10]: https://www.sitemaps.org/protocol.html "Sitemaps XML format — sitemaps.org"
[11]: https://ogp.me/ "The Open Graph protocol"
[12]: https://developers.google.com/search/docs/appearance/page-experience "Understanding page experience in Google Search results — Google Search Central"
[13]: https://web.dev/articles/vitals "Web Vitals — web.dev"
[14]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Introduction to structured data markup in Google Search — Google Search Central"
