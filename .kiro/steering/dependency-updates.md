# Dependency Updates

## Commit Type for Dependency Updates

Dependency updates that change `package.json` or `package-lock.json` **must** use `fix:` as the commit type, not `chore:`.

This project uses semantic-release with the default commit-analyzer. Only `fix:` and `feat:` (and breaking changes) trigger a release. Using `chore:` means the updated dependencies never reach npm consumers until some other releasable commit lands — which could be weeks or months.

### Why `fix:`?

- Consumers install this package via npm. They get whatever version semantic-release last published.
- Dependency updates (especially to `@modelcontextprotocol/sdk`) change runtime behaviour, fix bugs upstream, and close vulnerabilities.
- A patch release (`fix:`) correctly signals "same API, updated internals" to consumers.
- `chore:` produces no release, so consumers stay on stale transitive dependencies indefinitely.

### Rules

| Change | Commit type | Release |
|--------|-------------|---------|
| Runtime dependency update (e.g. `@modelcontextprotocol/sdk`) | `fix:` | patch |
| Dev dependency update (vitest, semantic-release, etc.) | `fix:` | patch |
| New runtime dependency added | `feat:` | minor |
| Dependency removed | `fix:` or `feat:` depending on impact | patch/minor |

### Commit Message Format

```
fix: update dependencies to latest

- @modelcontextprotocol/sdk 1.12.1 -> 1.30.0 (minor)
- vitest 4.1.6 -> 4.1.11 (patch)
- ...
```

If only dev dependencies changed, you may note that in the body but the type is still `fix:`.

### Workflow

1. `npx npm-check-updates` to see what's available
2. `npx npm-check-updates -u` to update package.json
3. `npm install` to regenerate the lockfile
4. `npm run build` to confirm compilation
5. `npm test` to confirm all tests pass
6. Commit with `fix: update dependencies to latest`
7. Push and open a PR

### Dependabot PRs

When consolidating dependabot PRs or running the dependabot-flow, the same rule applies: the consolidated commit must be `fix:`, not `chore:`. This ensures the consolidated update actually reaches consumers.
