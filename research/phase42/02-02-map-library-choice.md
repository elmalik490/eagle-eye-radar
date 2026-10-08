# مقارنة Leaflet وMapLibre GL JS للتطبيق الثابت

## القرار

**التوصية: الاحتفاظ بـ Leaflet حالياً.** لتطبيق صغير ثابت على GitHub Pages، لا توجد فائدة كافية لتبديله لمجرد استخدام تقنية أحدث. يكون الانتقال مشروطاً بظهور حاجة قابلة للقياس: خريطة متجهات كثيفة، تصميم بياناتي متعدد الطبقات، تجميع/تصفية على نطاق كبير، أو مؤثرات WebGL/ثلاثية الأبعاد. هذا حكم منتج مبني على المفاضلات التالية، وليس ادعاءً بأن أحد المشروعين أسرع دائماً.

## الحزمة ووقت التشغيل

Leaflet يعلن نحو **42 KB JavaScript مضغوطاً بـ gzip**، وCSS بحجم 3.5 KB مضغوطاً، مع عدم وجود تبعيات خارجية في الصفحة الرسمية [1]. ولتوفير نقطة قياس قابلة لإعادة الإنتاج، نزّلت حزم npm الحالية وقت البحث: `leaflet@1.9.4` أعطى `dist/leaflet.js` حجماً 42,567 بايت gzip، بينما `maplibre-gl@6.13.0` أعطى `dist/maplibre-gl.mjs` حجماً 285,731 بايت gzip، وworker منفصلاً 144,062 بايت وCSS بحجم 10,595 بايت (قياس محلي باستخدام `gzip -n`؛ لا يمثل بالضرورة حجم التحميل النهائي بعد bundling أو التخزين المؤقت) [8] [9]. إذن MapLibre ليس مجرد استبدال اسم: هو محرك TypeScript يستخدم WebGL، ويحتاج style document ومصادر بلاطات، وقد يفشل تهيئة GPU ويجب على التطبيق معالجة ذلك [4] [7]. هذه كلفة أولية واحتياط توافق مهمان لتطبيق ثابت ومحمول؛ اختبر الأداء الفعلي على أجهزة الجمهور قبل ادعاء مكسب.

## raster وvector والتصميم

نموذج Leaflet مباشر: `TileLayer` يحمل صور البلاطات من قالب URL، وتتوفر طبقات GeoJSON وخطوط ومضلعات ودوائر، مع رسم SVG أو Canvas وخيارات لون/سُمك/شفافية [2]. هذا ممتاز لخلفية raster ومجموعة overlays صغيرة، كما أن CSS وHTML يجعلان التعديل البصري مألوفاً.

MapLibre يفصل **source** عن **layer**: المصدر قد يكون vector أو raster أو GeoJSON، والطبقة تحدد كيف يُعرض المصدر. مواصفة MapLibre تدعم طبقات `fill` و`line` و`symbol` و`circle` و`heatmap` و`raster` و`fill-extrusion` وغيرها، مع خصائص وتعبيرات data-driven [5] [6]. لذلك هو أقوى عندما يلزم تغيير الألوان والأحجام حسب خصائص المعالم أو zoom، أو عندما تأتي البيانات من vector tiles. لكنه يضيف التزاماً بمواصفة style، و`source-layer`، وبنية TileJSON/البلاطات؛ وهذا عبء صيانة لا تحتاجه خريطة raster بسيطة.

## الهاتف، العلامات، والتفاعل

Leaflet يوفر افتراضياً السحب مع inertia، وscroll/double-click/pinch zoom، وتحديداً بالسحب، وأحداث المؤشر وسحب العلامة، ويذكر دعم Chrome وFirefox وSafari وEdge والمنصات المحمولة [1]. علامته كائن قابل للنقر والسحب، ويمكن تعديلها كصورة أو HTML، مع popups وCSS واضح [2].

MapLibre يضع `Marker` و`Popup` وعناصر التحكم خارج عنصر canvas، ويدعم السحب والأحداث، بينما تُرسم معالم كثيرة عادةً كـ `symbol`/`circle` layers داخل WebGL [4] [6]. **الحكم العملي:** استخدم DOM markers القليلة في أي منهما؛ وعند كثرة النقاط، لا تنشئ آلاف عناصر DOM لمجرد سهولة البداية، بل اختبر طبقة بيانات واحدة/تجميعاً في MapLibre أو تبسيط البيانات في Leaflet. لا توجد عتبة عامة صالحة لكل الأجهزة.

## الوصول Accessibility

Leaflet لديه افتراضات مفيدة: الخريطة والعلامات قابلة للتشغيل بلوحة المفاتيح، و`keyboard` للعلامة مفعّل افتراضياً، مع `alt` و`title` وpan تلقائي عند التركيز. توصي وثيقته باسم وصفي فريد لكل علامة واختبار لوحة المفاتيح وقارئ الشاشة [2] [3]. MapLibre يضبط للعلامة الافتراضية `role=img` أو `role=button` حسب التفاعل، ويضيف focus/tabindex وسلوك الأسهم للعلامة القابلة للسحب؛ أما العنصر المخصص فتظل شجرة الوصول فيه مسؤولية التطبيق [4]. في كلا الخيارين يجب توفير قائمة/ملخص HTML بديل للبيانات المهمة، وعدم اعتبار canvas أو النقاط وحدها بديلاً مضموناً لقارئ الشاشة (توصية تصميمية).

## الترخيص والصيانة والتوسع

Leaflet مرخّص BSD-2-Clause، وMapLibre GL JS مرخّص BSD-3-Clause؛ كلاهما ترخيص permissive، لكن ترخيص مزود البلاطات والبيانات ومتطلبات attribution منفصلان ويجب إبقاؤهما في التطبيق [1] [4] [5]. كلا المشروعين له مستودع رسمي وCI وتوثيق؛ صفحات npm وقت البحث تعرض Leaflet 1.9.4 وMapLibre 6.13.0، بينما موقع Leaflet يعرض 2.0.0-alpha.1. لذلك ثبّت نسخة محددة وراقب changelog بدلاً من `latest` [1] [8] [9]. منظومة إضافات Leaflet تقلل كود التطبيق لكنها تضيف سطح صيانة واختبار وصول؛ ودليل Leaflet يحذر من أن الإضافات قد تحسن الوصول أو تضعفه [3]. في MapLibre، الاعتماد على style spec ومصادر tiles يجعل تحديث البيانات والبنية التحتية جزءاً من الصيانة.

للتوسع الواقعي، يوصي دليل MapLibre للـGeoJSON الكبير بتصغير الملفات، تقسيمها أو بثها، vector tiling، clustering وتبسيط الأسلوب؛ كما يذكر أن tiling على الخادم يحتاج إعداداً أكبر [7]. GitHub Pages يمكنه نشر ملفات ثابتة، لكنه لا يحل وحده توليد tiles أو خدمة بيانات ديناميكية. **الإجراء:** احتفظ بـLeaflet، قِس حجم bundle ووقت أول رسم وFPS على هاتف بطيء، وراقب عدد المعالم وطلبات البلاطات. أعد القرار فقط إذا تجاوزت هذه القياسات ميزانية الأداء أو أصبح style/vector-tile/3D مطلباً حقيقياً؛ عندها يكون MapLibre انتقالاً مبرراً، لا ترقية للحداثة.

## المراجع

[1]: https://leafletjs.com/ "Leaflet — a JavaScript library for interactive maps"
[2]: https://leafletjs.com/reference.html "Leaflet API reference"
[3]: https://leafletjs.com/examples/accessibility/ "Leaflet: Accessible maps"
[4]: https://www.maplibre.org/maplibre-gl-js/docs/ "MapLibre GL JS documentation — Introduction"
[5]: https://maplibre.org/maplibre-style-spec/sources/ "MapLibre Style Spec — Sources"
[6]: https://maplibre.org/maplibre-style-spec/layers/ "MapLibre Style Spec — Layers"
[7]: https://maplibre.org/maplibre-gl-js/docs/guides/large-data/ "Optimising MapLibre Performance: Tips for Large GeoJSON Datasets"
[8]: https://www.npmjs.com/package/leaflet "leaflet package on npm"
[9]: https://www.npmjs.com/package/maplibre-gl "maplibre-gl package on npm"
[10]: https://github.com/Leaflet/Leaflet "Leaflet GitHub repository"
[11]: https://github.com/maplibre/maplibre-gl-js "MapLibre GL JS GitHub repository"
