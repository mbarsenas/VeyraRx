# SmarteRX Security Hardening Register

This living document records security controls, production-hardening work, verification evidence, and remaining risks for the SmarteRX member application. Update it whenever a security-relevant behavior, dependency, schema, environment setting, or test changes.

## Security boundary

Protected member data follows this identity chain:

```text
Neon Auth user ID
  -> members.external_auth_id
  -> members.id (member_id)
  -> member-scoped queries and PostgreSQL row-level security
```

The browser never chooses the trusted `member_id`. Server-side code resolves it from the authenticated Neon Auth session. Member identifiers supplied through URLs or request bodies must not replace this resolver.

## Implemented controls

### Authentication

- Neon Auth provides email/password authentication and session cookies.
- `/dashboard/*` routes are protected by authentication middleware.
- Production defaults to real authentication; demo authentication is not the production fallback.
- Sign-out terminates the current Neon Auth session.
- Profile displays the active-session count and can revoke other sessions.
- Password recovery uses Neon Auth reset tokens.
- Password-reset responses avoid revealing whether an email address exists.
- Signup requests email verification.
- Signed-in members can request a new verification email from Profile.
- Passwords and reset tokens are never written to application audit metadata.

### Member isolation and authorization

- Authenticated member resolution uses `members.external_auth_id`.
- Claims, prescriptions, benefits, orders, messages, activity, profile, and pharmacy preferences are scoped to the resolved member.
- Claim detail requires both claim ID and resolved member ID.
- The production Data API uses the authenticated JWT and PostgreSQL RLS.
- Direct PostgreSQL fallbacks retain explicit `member_id` predicates.
- Process-global member caching was removed to prevent identity reuse across requests.
- Member-facing dashboard components no longer import Mark-specific mock identity, activity, plan, or pharmacy data.

### Claims and benefit integrity

- Paid, Rejected, Reversed, and Pending claims receive distinct treatments.
- Rejected claims do not show misleading final member responsibility.
- Reversals reference the original claim and do not present a current amount due.
- Related prescription-to-claim links remain member scoped.
- Deductible and out-of-pocket usage is calculated from the authenticated member's paid claims.
- Rejected and reversed transactions do not contribute to claim-driven accumulators.

### Audit events

Audit records are stored in `public.auth_audit_events` and are unavailable through the member Data API. Trusted server-side code writes them through the production database connection.

Current event types:

| Event | Identity | Metadata |
| --- | --- | --- |
| `account_created` | Neon Auth user ID when returned | Normalized email |
| `verification_email_requested` | Neon Auth user ID when returned | Normalized email |
| `email_verified` | Neon Auth user ID | Normalized email |
| `sign_in_succeeded` | Neon Auth user ID from the established session | Normalized email |
| `sign_out` | Neon Auth user ID | None |
| `password_reset_requested` | Not asserted, to prevent account enumeration | Normalized submitted email |
| `password_reset_completed` | Not asserted by the token-only reset flow | None |
| `other_sessions_revoked` | Neon Auth user ID | None |

Audit logging is best effort: authentication must not fail solely because audit storage is temporarily unavailable. Failures are emitted to protected server logs as `Unable to record authentication audit event`.

### Database protections

- Member tables use foreign keys and member ownership columns.
- RLS is enabled for Data API-accessible member data.
- Claim RLS maps `member_claims.member_id` to `members.external_auth_id = auth.user_id()`.
- `auth_audit_events` has RLS enabled and no member-facing policy.
- Audit writes require the trusted server connection configured as `DATABASE_URL`.
- Schema migrations are versioned in `db/migrations`.

### Production configuration

Required production settings include:

- `VEYRA_AUTH_MODE=production`
- `VEYRA_DATA_PROVIDER=data-api`
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEON_DATA_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL` using a protected Neon server role for audit writes

Secrets must remain in the deployment platform and must never be committed, pasted into tickets, screenshots, logs, or this document.

## Verification evidence

### Two-user isolation test

A second synthetic member was linked to a distinct Neon Auth identity and given a uniquely named prescription and claim.

Verified in production:

- The isolation member saw only its prescription and claim.
- The original member could not see the isolation prescription or claim.
- The isolation member could not see the original member's claims, prescriptions, identity, or activity.
- Sidebar identity and member ID changed with the authenticated user.
- Overview, Claims, Prescriptions, Benefits, and Profile loaded with member-scoped data.
- Claim-driven deductible values differed correctly between members.

The synthetic isolation member should remain available as a regression fixture until an automated end-to-end replacement exists.

### Automated checks

The repository test suite verifies:

- Data API claim history uses a member filter.
- Claim detail requires claim ID and member ID.
- PostgreSQL claim fallback retains member scoping.
- Data API orders and messages are member scoped.
- PostgreSQL order and message fallbacks retain member scoping.

Run before security-relevant releases:

```bash
npm run typecheck
npm test
npm run build
```

The production build requires non-secret configuration values at build time. Real credentials must not be used in CI validation.

## Relevant migrations and commits

### Migrations

- `009_member_rls_data_api.sql` — member Data API and RLS hardening
- `010_member_claims.sql` — member claims and claim RLS
- `011_auth_audit_events.sql` — authentication audit storage
- `011_smarterx_brand.sql` — member-facing SmarteRX data branding

### Security-related commits

- `0a102b5` — authenticated Claims integration and claim-driven benefits
- `a458851` — password recovery, verification request, production auth defaults, and audit storage
- `813cbcd` — merge of production Data API hardening with product work
- `9fbf210` — removal of cross-member mock data and global member cache
- `b26be45` / `c9921da` — authenticated user ID in sign-in audit events
- `da953ba` — recovery audit events, session controls, and zero-order state

## Operational checks

Before each production release:

1. Confirm required migrations exist on the production Neon branch.
2. Confirm Vercel production points to the intended Git branch and Neon branch.
3. Confirm `DATABASE_URL` is available to production functions without exposing its value.
4. Run typecheck, tests, and production build.
5. Test sign-in, sign-out, password recovery, and email verification.
6. Query recent audit events and confirm expected identities and timestamps.
7. Repeat the two-user isolation smoke test after authorization or repository changes.
8. Review server logs for audit failures, authentication errors, and unexpected Data API responses.

## Remaining hardening backlog

- Confirm password-reset completion revokes existing sessions according to Neon Auth production configuration.
- Add automated browser-level two-user isolation tests.
- Add explicit tests for benefits, profile, pharmacy preference, and activity isolation.
- Add failed-sign-in audit telemetry with rate limiting and without leaking credentials.
- Define audit retention, access-review, export, and deletion policies.
- Add alerting for repeated authentication failures and audit-write failures.
- Add Content Security Policy and review other production security headers.
- Review dependency and secret scanning in CI.
- Remove or feature-gate reviewer scenarios before a non-evaluation release.
- Replace remaining synthetic plan/product terminology where member-facing branding requires it.

## Change log

| Date | Change |
| --- | --- |
| 2026-08-26 | Created the register after production two-user isolation, account recovery, session-control, and audit verification. |
| 2026-08-26 | Added a Profile email-OTP request and code-entry workflow after distinguishing reset emails from verification codes. |
