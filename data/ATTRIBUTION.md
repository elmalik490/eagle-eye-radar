# World map data

`countries-110m.geojson` is a locally bundled, simplified derivative of Natural Earth 1:110m Admin 0 Countries. It contains public country-boundary geometry and reduced attributes (`name`, `iso_a3`, `continent`); Antarctica is omitted to keep the usable-city world view legible. The boundaries use Natural Earth's default de facto depiction and are general-purpose cartography, not a legal boundary authority.

Natural Earth states that all versions of its vector and raster map data are in the **public domain**, with no permission or credit required. Credit is retained here for provenance: “Made with Natural Earth.”

Sources:
- [Natural Earth Admin 0 Countries (1:110m, version 5.1.1 page)](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/)
- [Natural Earth Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/)
- [Natural Earth Vector repository / source GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson)

The file is simplified at 0.16 degrees with topology preservation for static world-level display. Simplification may omit small islands and fine boundary detail. It is not a dataset of businesses, signals, or commercial events. SHA-256 of the bundled file at generation: `6aa9c61bc36eb3b36a3c9d1fd104a291ebd86ca128571f5a0c16b8736673ede9`.
