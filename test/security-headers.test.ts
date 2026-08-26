import assert from "node:assert/strict";
import test from "node:test";
import { createContentSecurityPolicy, getSecurityHeaders } from "../lib/security/headers";

test("production responses include the required browser security headers", () => {
  const headers = new Map(getSecurityHeaders("production").map(({ key, value }) => [key, value]));

  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("Cross-Origin-Opener-Policy"), "same-origin");
  assert.equal(headers.get("Cross-Origin-Resource-Policy"), "same-origin");
  assert.match(headers.get("Strict-Transport-Security") ?? "", /max-age=31536000/);
  assert.match(headers.get("Permissions-Policy") ?? "", /camera=\(\)/);
});

test("production CSP blocks framing and limits network connections", () => {
  const policy = createContentSecurityPolicy("production");

  assert.match(policy, /default-src 'self'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /form-action 'self'/);
  assert.match(policy, /connect-src 'self' https:\/\/\*\.neon\.tech wss:\/\/\*\.neon\.tech/);
  assert.doesNotMatch(policy, /'unsafe-eval'/);
});

test("development CSP permits the evaluator required by local Next tooling", () => {
  assert.match(createContentSecurityPolicy("development"), /'unsafe-eval'/);
});
