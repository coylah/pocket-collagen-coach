## Plan

1. **Check GitHub sync status**
   - Compare the local project with the latest `origin/main` commit.
   - Confirm whether new GitHub changes are already present or still pending in Lovable.

2. **Sync safely**
   - Bring the project up to date with the latest GitHub files without modifying app logic manually.
   - Avoid touching the Collagen Coach scoring, AI prompt, food matrix, or existing working functionality unless GitHub already changed them.

3. **Verify the result**
   - Confirm the current commit/hash matches the latest GitHub state.
   - Refresh the preview/HMR cache so the latest files are served.
   - Report whether anything changed locally or whether the project was already synced.

## Technical notes

- I will not make design, UX, AI, scoring, or feature changes during this sync.
- If GitHub contains conflicts or changes that cannot be applied automatically, I will stop and report exactly what needs your decision.