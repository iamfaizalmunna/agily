# RBAC matrix (server mutations)

Scope: every mutation must resolve **team** via `slug` + `getMembership` / `requireTeamMember`, then enforce **role** helpers in `src/lib/items/permissions.ts` and `src/lib/rbac/roles.ts`.

| Action area | Representative action | Min role | Extra gate |
|-------------|----------------------|----------|------------|
| Board write | create/update/move item | `member` | `canWriteBoard` |
| Board read | list/export | `viewer` | membership |
| Comments | `addCommentAction` | `member` | `canComment` |
| Projects | `createProjectAction` | `member` | `canCreateProject(settings)` |
| Archive project | archive | `admin` | `canArchiveProject` |
| Team settings | `updateTeamSettingsAction` | `admin` | `requireTeamMember(..., "admin")` |
| People | `changeMemberRoleAction` | `admin` | `canChangeMemberRole` |
| People | `removeMemberAction` | `admin` | `canRemoveMember` |
| Invites | `createInviteAction` | `member`+ | `canInvite(settings)` |
| Labels | create/update/delete | `admin` | `canEditSettings` |
| CSV import | `importBoardCsvAction` | `member` | `canWriteBoard` + team-scoped `project` |
| Lens API | `POST /v1/lens/ask` | `viewer`+ | `teamMember` for `slug` in body |

**IDOR pattern:** Prisma queries include `teamId` / `project: { teamId, slug }` — never update by bare `itemId` alone.

**Guard helper:** `requireTeamMember(userId, slug, minRole)` in `src/lib/teams/require-membership.ts`.

Automated checks: `src/lib/security/idor-rbac.test.ts`.
