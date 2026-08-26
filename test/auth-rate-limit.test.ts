import assert from "node:assert/strict";
import test from "node:test";
import { authRateLimitPolicies, checkAuthRateLimit } from "../lib/auth/rate-limit";
import type { SqlExecutor } from "../lib/data/postgres-member-repository";

test("sign-in rate limiting allows attempts below the configured threshold", async () => {
  let capturedParams: unknown[] = [];
  const executor: SqlExecutor = async <T>(_statement: string, params: unknown[] = []) => {
    capturedParams = params;
    return [{ attempt_count: 4 } as T];
  };

  const result = await checkAuthRateLimit(
    "  MEMBER@Example.Test ",
    authRateLimitPolicies.signIn,
    executor
  );

  assert.equal(result.allowed, true);
  assert.deepEqual(capturedParams, ["sign_in_failed", "member@example.test", 900000]);
});

test("sign-in rate limiting blocks attempts at the configured threshold", async () => {
  const executor: SqlExecutor = async <T>() => [{ attempt_count: "5" } as T];
  const result = await checkAuthRateLimit(
    "member@example.test",
    authRateLimitPolicies.signIn,
    executor
  );

  assert.equal(result.allowed, false);
  assert.equal(result.retryAfterSeconds, 900);
});

test("password-reset and verification policies use their documented limits", () => {
  assert.deepEqual(authRateLimitPolicies.verificationEmail, {
    eventType: "verification_email_requested",
    maxAttempts: 3,
    windowMs: 900000,
  });
  assert.deepEqual(authRateLimitPolicies.passwordReset, {
    eventType: "password_reset_requested",
    maxAttempts: 3,
    windowMs: 3600000,
  });
});

test("rate-limit storage failures preserve account access and are logged server-side", async () => {
  const originalConsoleError = console.error;
  let logged = false;
  console.error = () => { logged = true; };
  const executor: SqlExecutor = async () => { throw new Error("database unavailable"); };

  try {
    const result = await checkAuthRateLimit(
      "member@example.test",
      authRateLimitPolicies.signIn,
      executor
    );
    assert.equal(result.allowed, true);
    assert.equal(logged, true);
  } finally {
    console.error = originalConsoleError;
  }
});
