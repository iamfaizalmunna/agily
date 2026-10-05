# Test coverage

CI runs `npm run test:coverage` with the pack defined in `.c8rc.json`.

| Metric     | Threshold | Notes |
|------------|-----------|--------|
| Lines      | 100%      | Enforced |
| Statements | 100%      | Enforced |
| Functions  | 100%      | Enforced |
| Branches   | 100%      | Enforced |

Domain tests cover behavior; `/* c8 ignore next */` markers sit only on lines where tsx/V8 still reports unreachable **export** instrumentation branches after imports are exercised.

To inspect locally: `npm run test:coverage` then open `coverage/index.html`.
