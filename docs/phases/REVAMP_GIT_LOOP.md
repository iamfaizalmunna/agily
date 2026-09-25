# Revamp git loop (branch → push → PR → merge)

Use this for **R5+** (and retroactively how R1–R4 landed on GitHub).

## Per phase

1. `git checkout main && git pull origin main`
2. `git checkout -b revamp/r{N}-{short-name}`
3. Implement phase doc + tests + update `REVAMP_README.md`
4. `git commit` on the branch
5. `git push -u origin revamp/r{N}-{short-name}`
6. `gh pr create --base main --head revamp/r{N}-{short-name} --title "Revamp R{N}: …" --body "…"`
7. `gh pr merge --merge` (or merge in GitHub UI)
8. `git checkout main && git pull origin main`
9. Start **R{N+1}** only after merge

## Rules

- One revamp PR at a time on `main`
- Do not stack R6 on GitHub while R5 is open
- Local `main` should match `origin/main` before cutting the next branch
