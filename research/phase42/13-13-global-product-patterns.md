# أنماط منتجات جغرافية ناجحة عبر أسواق مختلفة

## Evidence note

This comparison covers three products across US and European contexts, using official documentation and public examples rather than popularity claims. Esri was founded in Redlands, California; CARTO began in Madrid in 2012; HERE’s official docs and Amsterdam office page establish a European operating context. [1] [2] [3]

### What the products make easy

**Esri ArcGIS Map Viewer + StoryMaps (US).** Map Viewer supports zoom, pan, rotate, reset/default extent, bookmarks, and keyboard shortcuts. Search can be filtered by organization, categories, authoritative status, and current map extent; the item pane exposes descriptions before opening a map. [4] This supports exploration and recovery from disorientation. StoryMaps combines maps and 3D scenes with text, images, video, audio, and embeds. “Express maps” add points, pop-ups, and arrows inside the story, and the gallery shows public conservation and urban-change examples. [5] **Product judgment:** the transferable design is the hand-off between an exploratory map and a guided narrative, not Esri’s visual identity.

**CARTO (European origin, cloud-native analytics).** CARTO documents a warehouse-native platform for interactive maps, analytical workflows, apps, and data engineering. [6] Its public examples show a data-to-decision loop: climate-risk scoring, SQL-parameter filtering of NYC trips, widget-driven earthquake heatmaps, building-level flood detail, and parking availability with walk-time isolines. H3 indexes, dynamic tiling, and real-time APIs address scale and changing data. [7] The Data Observatory adds trust through catalog filters, free samples, public subscriptions, vetted premium sources, and documented warehouse/region behavior. [8] **Product judgment:** expose the transformation from source to indicator to decision, not just the final color ramp.

**HERE Maps API for JavaScript (Europe).** HERE documents pan, zoom, pinch-to-zoom, vector/raster/hybrid views, geocoding, place search, routing, transit, isolines, traffic, and custom objects. [9] Its UI module adds zoom, map/satellite and traffic selection, a scalebar, distance measurement, zoom-to-rectangle, info bubbles, and an overview map; controls can be localized, repositioned, hidden, or disabled. [10] **Product judgment:** connecting “where?” (search), “how?” (routing), and “what now?” (traffic) is decision-oriented, but API flexibility leaves teams responsible for safe defaults and data-condition explanations.

### Transferable principles

1. **Navigation:** provide a stable minimum set—zoom, pan, reset/default extent, scale, and a visible current context. Add bookmarks, overview, search, and keyboard equivalents when the map is part of a longer workflow. This combines Esri’s recovery mechanisms with HERE’s explicit scale and overview controls. [4] [10]
2. **Storytelling:** use progressive disclosure. Start with a short claim or question, then let readers inspect the map, filters, and evidence. Esri’s map-plus-media narrative and CARTO’s live analytical examples support this pattern without copying either brand. [5] [7]
3. **Data-to-decision:** make every layer answer a decision question. Use filters, widgets, scores, routes, or isolines only when the resulting action is stated. Keep the raw measure, aggregation level, time window, and update state visible; these are product recommendations derived from the documented workflows, not claims that the vendors guarantee correct decisions. [7] [8] [9]
4. **Trust and inclusion:** show source, date, spatial/temporal extent, method, licensing, and known limitations near the map. ISO 19115 describes metadata fields for identification, extent, quality, spatial and temporal schema, reference system, and distribution, while ArcGIS demonstrates a practical “authoritative” status and deprecated-content workflow. [11] [12] For an interactive product, apply WCAG’s requirement that functionality be keyboard-operable and that interface component names, roles, and states be programmatically determinable. [13]

### Technical trade-offs and Eagle Eye actions

Cloud-native analytics and dynamic tiling can improve scale and freshness, but can hide query cost, aggregation, or latency; show resolution and freshness rather than implying precision. Rich narrative sequencing improves comprehension, but can reduce free exploration; offer “read mode” and “explore mode.” Highly configurable APIs enable fit-for-purpose workflows, but increase inconsistency; establish a small design system for controls, legends, empty states, error states, and provenance panels.

For Eagle Eye Radar, prioritize: (a) reset, bookmarks, scale, keyboard navigation, and a current-extent indicator; (b) a story rail that links each claim to a map state and source; (c) decision widgets that show metric definition, geography, time, and confidence/coverage; and (d) a persistent “data card” with source, update timestamp, method, license, and authoritative/deprecated state. These are recommendations based on the evidence above, not copied features or unsupported claims about adoption.

## References

[1]: https://www.esri.com/en-us/about/about-esri/company "Company | About Esri"
[2]: https://carto.com/about-us/ "About Us | CARTO"
[3]: https://www.here.com/about/here-offices/amsterdam "Amsterdam Office | HERE"
[4]: https://doc.arcgis.com/en/arcgis-online/get-started/view-maps-mv.htm "View maps—ArcGIS Online Help"
[5]: https://www.esri.com/en-us/arcgis/products/arcgis-storymaps/overview "ArcGIS StoryMaps: Digital Stories & Presentations"
[6]: https://docs.carto.com/ "CARTO Documentation: Welcome"
[7]: https://carto.com/blog/2024-best-maps-dataviz/ "24 of the best maps, visualizations & analysis from 2024"
[8]: https://docs.carto.com/carto-user-manual/data-observatory "Data Observatory—CARTO User Manual"
[9]: https://docs.here.com/maps-api-for-js/docs/introduction-maps-api-for-javascript "Introduction to HERE Maps API for JavaScript"
[10]: https://docs.here.com/maps-api-for-js/docs/map-controls-ui "Customize maps with map controls and UI"
[11]: https://www.iso.org/standard/26020.html "ISO 19115:2003 Geographic information—Metadata (withdrawn; successor linked by ISO)"
[12]: https://doc.arcgis.com/en/arcgis-online/administer/manage-items.htm "Manage content—ArcGIS Online Help"
[13]: https://www.w3.org/TR/WCAG21/ "Web Content Accessibility Guidelines (WCAG) 2.1"
