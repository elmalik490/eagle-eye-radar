# هندسة معلومات لوحات الاستخبارات والتحليلات

## Evidence note

A dashboard is best treated as a **scan-first overview**, not a repository for every field. Nielsen Norman Group defines dashboards as single-page visualizations that provide “at-a-glance information” for quick action, rather than expansive exploratory views. [1] For Eagle Eye, the landing view should answer “what needs attention?” quickly; deeper investigation should sit behind deliberate interaction.

### A scan-first hierarchy

Tableau and Power BI give the same basic reading order: put the highest-level or most important information in the upper-left, then move toward supporting detail in the normal reading direction. [2] [3] This is a layout rule, not a claim about which Eagle Eye measures matter.

**Transferable structure (product judgment):** reserve the first visual band for an approved headline state or summary; place the principal pattern or comparison next; put supporting context and exceptions after it; expose record-level evidence only after selection. Do not invent a KPI set to fill the first band. If no approved summary exists, use a clear state label, timestamp/data currency, and the most important approved view.

Power BI describes a dashboard as an overview whose underlying reports/models contain the details, and advises not putting detail on the dashboard unless readers need to monitor it. [3] Tableau recommends limiting a dashboard to two or three views because too many can obscure the big picture and hurt performance. [2] For Eagle Eye, keep the landing canvas intentionally small and make “more detail” a destination rather than another tile.

### Overview → zoom/filter → details on demand

Shneiderman’s visual information-seeking mantra is “overview first, zoom and filter, then details-on-demand.” His taxonomy defines overview as seeing the collection, zoom/filter as focusing and removing uninteresting items, and details-on-demand as selecting an item or group to retrieve its attributes. [4] The EU Data Visualisation Guide restates the sequence: show the overall trend or distribution, bring interesting items into focus, then reveal details through hover, search, or selection. [5]

**Transferable interaction model (product judgment):** (1) load a stable overview with current scope explicit; (2) narrow scope with a small set of visible, understandable filters; (3) preserve context while highlighting or zooming the affected view; (4) open a detail drawer, tooltip, or drill-through for the selected item/group. Keep selected filter state and one-click reset visible. Exact fields and entities must come from Eagle Eye’s approved data model.

A systematic review of dashboard usability criteria lists hierarchical detail, multiple aggregation levels, visible applied filters, user control, overview/zoom/filter/details-on-demand, drill-up/down, and data-set reduction as relevant criteria. [6] This supports filters and drill-down as coordinated information architecture, not scattered controls.

### Summaries, visual encoding, and clutter controls

Power BI recommends making important information stand out, using cards for a prominent important number, providing context, avoiding scroll bars where possible, removing nonessential information, and keeping axes, colors, time frames, precision, and sorting consistent. [3] Tableau supports filter controls, search, null controls, and clear filter titles while recommending few views. [2]

NN/g reports that length and two-dimensional position support efficient quantitative comparison, while area and angle are harder to compare; color is useful for highlighting but should not encode quantitative magnitude. [1] **Product judgment:** use position/length for comparisons, color for limited categorical or alert emphasis, and text/context for meaning. Avoid decorative gradients, redundant legends, dense labels, and competing highlights. Provide non-color cues for important states.

### Technical trade-offs and acceptance checks

A compact overview improves scanning but can hide nuance; drill-through preserves hierarchy but adds interaction cost. More filters increase flexibility but can raise cognitive load and make scope ambiguous. More tiles increase coverage but reduce legibility and may worsen performance. These trade-offs follow from the guidance, not Eagle Eye measurements. [2] [3] [6]

**Recommended Eagle Eye acceptance checks (product judgment):** a first-time user can identify current scope and primary state without scrolling; every filtered view shows active scope; reset/undo is discoverable; selecting an item reveals details without losing the overview; the landing page stays within a small view budget; and emphasis remains interpretable without color alone. Validate with representative tasks and approved data, not invented business metrics.

## References

[1]: https://www.nngroup.com/articles/dashboards-preattentive/ "Dashboards: Making Charts and Graphs Easier to Understand" — Nielsen Norman Group.

[2]: https://help.tableau.com/current/pro/desktop/en-us/dashboards_best_practices.htm "Best Practices for Effective Dashboards" — Tableau Help.

[3]: https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips "Tips for designing a great Power BI dashboard" — Microsoft Learn.

[4]: https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf "The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations" — Ben Shneiderman, University of Maryland / IEEE (1996).

[5]: https://data.europa.eu/apps/data-visualisation-guide/the-information-seeking-mantra "The information seeking mantra" — data.europa.eu Data Visualisation Guide.

[6]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9977530/ "Usability Evaluation of Dashboards: A Systematic Literature Review" — PubMed Central.
