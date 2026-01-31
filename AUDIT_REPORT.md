# AUDIT_REPORT

Generated: 2026-01-31

## Scope

Target: `C:\Users\prada\Documents\sparkstage55\`  
Reference (read-only): `C:\Users\prada\Documents\Spark studio\`

Fokus audit ini adalah “backend plug-in” (Supabase migrations + Edge Functions) dan konsistensi integrasi Midtrans/Auth yang menyentuh backend.

## Metodologi Validasi (Tanpa Git)

- Tidak menggunakan `git diff` / git commands untuk validasi.
- Membandingkan file secara langsung dengan membaca konten dan menghitung SHA-256, lalu membandingkan hash + keberadaan file.
- Artefak validasi dibuat oleh script: [dir-compare.mjs](file:///c:/Users/prada/Documents/sparkstage55/tools/dir-compare.mjs)

## Hasil Validasi Backend (Supabase)

- **Supabase Edge Functions (folder layout & konten)**: **MATCH 100%**
  - Source: `Spark studio/supabase/functions`
  - Target: `sparkstage55/supabase/functions`
  - Bukti: [validation_supabase_functions.json](file:///c:/Users/prada/Documents/sparkstage55/validation_supabase_functions.json)
  - Ringkas: 5 file vs 5 file, same=5, different=0, missing=0

- **Supabase SQL migrations**: **MATCH 100%**
  - Source: `Spark studio/supabase/migrations`
  - Target: `sparkstage55/supabase/migrations`
  - Bukti: [validation_supabase_migrations.json](file:///c:/Users/prada/Documents/sparkstage55/validation_supabase_migrations.json)
  - Ringkas: 5 file vs 5 file, same=5, different=0, missing=0

Referensi cepat:
- Target Edge Functions: [supabase/functions](file:///c:/Users/prada/Documents/sparkstage55/supabase/functions)
- Target Migrations: [supabase/migrations](file:///c:/Users/prada/Documents/sparkstage55/supabase/migrations)

## Ringkasan Perbandingan Tree (Direct Compare)

Perbandingan ini **bukan** indikasi “backend mismatch”, karena kedua proyek memang memiliki banyak perbedaan UI/feature (admin pages, tests, i18n, dsb). Ini hanya menunjukkan status kesamaan file antar folder untuk subset file yang dibandingkan.

- Bukti: [validation_summary.json](file:///c:/Users/prada/Documents/sparkstage55/validation_summary.json)
- Counts:
  - source_files: 180
  - target_files: 92
  - same: 14
  - different: 36
  - only_in_source: 130
  - only_in_target: 42

Contoh kategori perbedaan (expected):
- **Hanya ada di Spark studio**: banyak komponen admin, test files, dan util tambahan.
- **Hanya ada di sparkstage55**: komponen UI/layout yang berbeda, halaman auth di `src/pages/auth/*`, dan artefak audit JSON.
- **Different (same path, different content)**: file frontend/core app seperti `package.json`, `src/App.tsx`, dan beberapa hooks/utils karena stack sparkstage55 berbeda dari Spark studio.

## Artefak Audit

- Laporan audit DB: [db_audit_report.json](file:///c:/Users/prada/Documents/sparkstage55/db_audit_report.json)
- Laporan audit Midtrans: [midtrans_audit_report.json](file:///c:/Users/prada/Documents/sparkstage55/midtrans_audit_report.json)
- Laporan audit Auth/Services: [auth_services_audit_report.json](file:///c:/Users/prada/Documents/sparkstage55/auth_services_audit_report.json)

## Catatan Git

- Validasi ini tidak bergantung pada git repo di `sparkstage55`.
- Folder `.git` di `sparkstage55` tidak digunakan untuk validasi.

