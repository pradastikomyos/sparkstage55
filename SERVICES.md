# Backend Services Documentation

This project integrates several backend services extracted from the legacy "Spark studio" project.

## 1. Authentication (Supabase Auth)
- **Location**: `src/contexts/AuthContext.tsx`
- **Logic**: Uses Supabase GoTrue for JWT-based authentication.
- **Features**:
  - `signIn(email, password)`
  - `signUp(email, password, name)`
  - `signOut()`
  - Automatic session refresh
  - Admin role check via `user_role_assignments` table

## 2. Payment Gateway (Midtrans)
- **Frontend Integration**: `src/utils/midtransSnap.ts` (Snap loader)
- **Status Mapping**: `src/utils/midtransStatus.ts`
- **Edge Functions**:
  - `create-midtrans-token`: Generates Snap token for ticket bookings.
  - `create-midtrans-product-token`: Generates Snap token for product orders.
  - `midtrans-webhook`: Handles server-to-server notifications from Midtrans.
  - `sync-midtrans-status`: Fallback function to sync status via Midtrans API.

## 3. Database (Supabase)
- **Client**: `src/lib/supabase.ts`
- **Schema**: Managed via Supabase dashboard.
- **Key Tables**: `orders`, `order_product_items`, `purchased_tickets`, `ticket_availabilities`, `user_role_assignments`.

## 4. Helper Utilities
- **Session Validation**: `src/utils/sessionValidation.ts` - Exponential backoff for session checks.
- **Error Handling**: `src/utils/sessionErrorHandler.ts` - Centralized 401 and network error management.
- **State Management**: `src/utils/bookingStateManager.ts` - Preserves booking intent across re-logins.
