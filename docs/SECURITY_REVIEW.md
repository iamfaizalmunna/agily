# Security review checklist (~30 min)

Use after S1–S12 or before a production deploy.

## Access control

- [ ] Viewer cannot mutate board (try quick edit / comment as `viewer@agily.com`).
- [ ] Cross-team slug or guessed `itemId` does not expose another studio’s data.
- [ ] Lens `ask` without session → 401; wrong `slug` → 404.

## Auth & sessions

- [ ] Sign-in errors are generic; throttle after repeated failures.
- [ ] Sign-out clears session cookie; `/signin` required for studio routes.
- [ ] Join link expired or malformed → safe message.

## Injection & XSS

- [ ] Ticket title/comment with `<script>` renders as text, not HTML.
- [ ] CSV import rejects oversize paste (see `import-bounds`).

## Transport & headers

- [ ] CSP present (report-only in dev, enforce in prod).
- [ ] App served over HTTPS in production; `APP_URL` matches.

## Clickjacking & downloads

- [ ] `X-Frame-Options` / frame ancestors policy set.
- [ ] CSV export filename sanitized.

## Open redirect

- [ ] `next` / return URLs stay under `/t/{slug}` (see `safeStudioNext`).

## Operator

- [ ] [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) completed.
- [ ] [SECURITY_EXCEPTIONS.md](SECURITY_EXCEPTIONS.md) reviewed after `npm audit`.

Automated smoke: `npm run test:e2e` (includes `e2e/security-smoke.spec.ts`).
