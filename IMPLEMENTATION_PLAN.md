# Eagle Eye v0.1 — Implementation Plan

| Rank | Improvement | Value | Effort | Risk | Decision |
|---|---|---:|---:|---:|---|
| 1 | Make synthetic opportunity figures explainable: sector-specific assumptions, transparent recoverable-revenue calculation, explicit illustrative-only labeling | High | Low | Low | Implement now |
| 2 | Replace generic evidence copy with a verification checklist and evidence-quality/status framing; keep all findings explicitly unverified | High | Low | Low | Implement now |
| 3 | Replace the generic approval alert with an editable, copyable draft and explicit local-only human review state; no sending | High | Low | Low | Implement now |
| 4 | Improve small-screen readability, touch targets, focus visibility, live status announcements and no-JS-CDN dependencies | Medium | Medium | Low | Implement selectively in existing page |
| 5 | Connect real data, CRM, backend, or automated messaging | Potentially high | High | High | Defer pending separate source, privacy, security, and authorization decisions |

## Guardrails

- Preserve the single-page v0.1 prototype, static deployment, existing locations/sectors, and scan/verify/draft flow.
- Do not claim real discovery, verification, leakage, or recovered revenue. Clearly distinguish demo assumptions from measured facts.
- No APIs, personal/business prospect data, external messages, or irreversible external actions.
- Validate core flows and mobile layout against GitHub Pages before committing.
