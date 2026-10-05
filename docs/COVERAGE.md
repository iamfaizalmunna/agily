# Test coverage

CI runs `npm run test:coverage` with the pack defined in `.c8rc.json`.

| Metric     | Threshold | Notes |
|------------|-----------|--------|
| Lines      | 100%      | Enforced |
| Statements | 100%      | Enforced |
| Functions  | 100%      | Enforced (`pack-exports.test.ts` smoke-imports module exports) |
| Branches   | 89% floor | ~90% today; remaining gaps are mostly optional/default-parameter and CSV/parser edge paths |

To inspect gaps locally: `npm run test:coverage` then open `coverage/index.html`.
