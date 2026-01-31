## Scope & Goal
- Make `C:\Users\prada\Documents\sparkstage55\` match `C:\Users\prada\Documents\Spark studio\` for backend-related logic (Supabase DB/migrations, Edge Functions, Midtrans integration, auth/service utilities).
- Treat `Spark studio` as read-only reference; apply changes only to `sparkstage55`.

## Quick Findings (From Read-Only Survey)
- Supabase Edge Functions exist in both, but folder layout differs:
  - Reference: `Spark studio\supabase\functions\...`
  - Target: `sparkstage55\supabase\...`
- Reference has Supabase SQL migrations under `Spark studio\supabase\migrations\...`; target currently has no `supabase\migrations\` directory.
- Some shared code is near-identical but not byte-identical (example: indentation differences in `src\utils\midtransSnap.ts`).

## Execution Orchestration (Exact Order)
### 1) DB Auditor (must run first)
- Compare DB schema expectations (from reference migrations and code usage) vs target.
- If Supabase MCP is configured, inspect the live Supabase project state: tables, constraints, extensions, RLS, and migrations history.
- Output: `db_audit_report.json` with:
  - Missing/mismatched tables/columns/types
  - FK/constraints drift
  - RLS policy differences
  - Migration gaps (reference vs target)

### 2) Midtrans Auditor (can run parallel after DB Auditor starts)
- Compare:
  - Edge Functions: `create-midtrans-token`, `create-midtrans-product-token`, `midtrans-webhook`, `sync-midtrans-status`, `complete-product-pickup`
  - Frontend Midtrans helpers (e.g., `src/utils/midtransSnap.ts`, `midtransStatus.ts`) and env var expectations
- Output: `midtrans_audit_report.json` with exact file-level mismatches and required sync actions.

### 3) Auth Services Auditor (can run parallel after DB Auditor starts)
- Compare auth/session/service utilities:
  - `src/contexts/AuthContext.tsx`
  - `src/utils/auth.ts`, `sessionValidation.ts`, `sessionErrorHandler.ts`, related hooks
  - Any missing companion files present in reference
- Output: `auth_services_audit_report.json` listing exact mismatches (including byte-level diffs where needed for 100% match).

## 4) Migration Fixer (runs only after all 3 reports exist)
- Apply all fixes to `sparkstage55` to achieve identical behavior and (where required by validator) identical file contents:
  - Normalize Supabase folder layout to match reference (`supabase/functions/...`)
  - Add missing `supabase/migrations/*.sql` from reference
  - Sync Edge Function code to exact reference versions
  - Sync Midtrans utilities and webhook logic
  - Sync auth/service utilities and any required supporting files
  - Update docs/config only if the reference has them and validator expects them
- Output: updated codebase + consolidated fix log.

## 5) Final Validator (must be last)
- Re-scan both trees and verify 100% match for the audited surface area.
- Run TypeScript/build/test checks as applicable to ensure nothing regresses.
- Write `AUDIT_REPORT.md` summarizing:
  - What differed
  - What was changed
  - What is now identical

## Deliverables
- `AUDIT_REPORT.md` (final)
- The three JSON audit reports (for traceability)

If you confirm this plan, I will begin Step 1 (DB Auditor) and follow the mandated execution order end-to-end.