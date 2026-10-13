# Ravenforge availability

Hourly external checks for the public Ravenforge website, plus direct TLS-expiry
checks. GitHub-hosted Ubuntu runs the workflow and notifies the owner by GitHub
e-mail on failure. The public repository contains no customer data, credential values, internal
addresses, contact submissions or deployment rights. A dedicated read-only probe
credential is held in GitHub Actions secrets and Cloudflare secret bindings; it
authorizes only these public-page checks.

Cloudflare Bot Fight Mode challenges direct GitHub HTTP checks. The fixed
Cloudflare Worker in `probe.mjs` therefore checks only the three public pages
and returns fresh status metadata through its workers.dev endpoint. The workflow
rejects stale, malformed, challenged or unsuccessful results. No arbitrary URL, write method or customer content is accepted by the probe.
Unauthorized callers are rejected before any origin request. Bot Fight Mode
and other website security settings remain enabled. The Worker is on the existing
Workers Free plan (100,000 requests/day); no paid upgrade or new subscription.

Run workflow_dispatch with simulate_failure=true to test the GitHub failure
notification, then run normally. The probe's failures also fail the workflow.
Scheduled runs can be delayed or missed. Public repositories' schedules can be
disabled after 60 days without repository activity. Review the schedule and email
notifications monthly and record the review here. This is best-effort monitoring,
not a paid uptime SLA.

Last operator review: 13 October 2026. Initial failure e-mail was received;
final success and source verification are recorded in the operational evidence.
