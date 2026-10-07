# Known Issues and Limitations

No blocking JavaScript error was observed in the documented live smoke test. The following limitations are intentional/known prototype behavior, not claims of production readiness.

## Synthetic-data limitations

- Risk values, confidence values, and evidence copy are hard-coded demo content. They are not measurements, predictions, verified incidents, or evidence about real businesses.
- The card explicitly labels the data `DEMO / SYNTHETIC` and `UNVERIFIED`; preserve those labels unless a separately approved, evidence-backed change replaces the underlying model.
- All sectors share the same location-based risk/confidence figures. Sector selection currently changes the displayed label only.

## Functional limitations

- The scan interaction uses a fixed 1.2-second timeout; it does not scan a data source.
- Verify displays static explanatory text; it does not verify evidence.
- Act displays a generic HVAC-oriented draft even when another sector is selected.
- The demo approval button only raises a local alert. There is no external send capability, approval record, persistence, or follow-up workflow.
- State exists only in the current page session and resets on reload.
- There is no automated test suite; browser checks are manual smoke tests.
- Styling uses Tailwind from a public CDN and may be unavailable without internet access.

## Handover / documentation limitations

- The private commercial-validation materials are intentionally excluded from this public repository. Transfer or permissions for those materials must be arranged separately if needed by another account.
- The public repository is not a safe destination for prospect identities, contact details, private research, or private spreadsheet contents.

## Updated prototype behavior — 2026-10-08
- The prior hard-coded location-only risk and confidence figures were replaced by fixed synthetic sector assumptions, an assumption-based monthly range, and a weighted demo-priority arithmetic. These remain fictional scenario presets, not validated estimates or confidence values.
- Sector-specific scenario prompt text replaces the earlier generic HVAC-only evidence paragraph; prompts are explicitly not observed signals.
- The Verify panel is now a human-led checklist. Checking boxes never verifies a business or changes the unverified status; there is no record persistence.
- The Act panel is now an editable/copyable internal note only. “Mark reviewed” is local page state, not an approval record; nothing is sent.
- Layout is responsive and no longer depends on Tailwind CDN. Browser compatibility and accessibility have only received prototype smoke testing, not formal audit.
