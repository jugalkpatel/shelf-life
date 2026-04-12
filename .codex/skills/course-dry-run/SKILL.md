---
name: course-dry-run
description: Use this skill when the user asks to dry-run, validate, rerun, publish, or reconcile the Self-Testing AI Agents course against the current `shelf-life` starter and `/Users/stevekinney/Developer/stevekinney.net/courses/self-testing-ai-agents`.
---

# Course Dry-Run

One workflow, two modes:

- **Default:** `audit-and-fix`. Build the manifest from `index.toml`, execute labs, validate lesson/lab/solution snippets, audit code coverage + success visibility + reader friction, apply fixes on branches, and stop before mutating `main`.
- **Publish:** only when the prompt explicitly says `publish`, `reconcile main`, `ship to main`, or equivalent language. That mode runs the final `main` reconciliation flow after the audit artifacts are clean.

## Start Here

1. Read [workflow.md](../../../tools/course-dry-run/references/workflow.md).
2. Read [snippet-validation.md](../../../tools/course-dry-run/references/snippet-validation.md) before judging snippet drift or illustrative partials.
3. Read [pitfalls.md](../../../tools/course-dry-run/references/pitfalls.md) only if you touch visual-regression baselines, CI workflow YAML, or `lefthook.yml`.
4. Generate the manifest and audit artifacts with:

```sh
node tools/course-dry-run/scripts/build-course-manifest.mjs \
  --course-root ../stevekinney.net/courses/self-testing-ai-agents \
  --out tmp/dry-run/<session-slug>/manifest.json

node tools/course-dry-run/scripts/audit-course-content.mjs \
  --manifest tmp/dry-run/<session-slug>/manifest.json \
  --out-dir tmp/dry-run/<session-slug>
```

5. Refresh the installed Codex mirror when this wrapper changes:

```sh
node tools/course-dry-run/install-codex-skill.mjs
```

6. Treat `manifest.json`, `validation-results.json`, and `summary.md` as the only canonical audit trail.
