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
