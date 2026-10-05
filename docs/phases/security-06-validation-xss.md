# S6 — Input validation & output encoding

**Status:** planned  
**Branch:** `security/s6-validation-xss`

## Goal

Bound attacker-controlled strings at the server; safe rendering in the UI.

## Deliverables

- [ ] **Zod audit:** every server action parses input with max lengths (title, body, lens name, custom field text, CSV import rows).
- [ ] **HTML safety:** ticket body and comments render as plain text or sanitized markdown (no raw HTML injection); audit `dangerouslySetInnerHTML` (theme boot only + documented).
- [ ] **URL fields:** reject `javascript:` in user-provided links if any href is built from user input.
- [ ] **Import CSV:** row limits, cell size caps (extend `import-validate`).
- [ ] Pack tests for new validators.

## Acceptance

- Payload like `<script>alert(1)</script>` in title/body does not execute in focus view.
- Oversized bulk/import rejected with clear error.

## Verify

```bash
npm test && npm run test:coverage && npm run build
```
