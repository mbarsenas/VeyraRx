import assert from "node:assert/strict";
import test from "node:test";
import { createSignInFailureMetadata } from "../lib/auth/audit";

test("failed sign-in audit metadata is normalized and intentionally limited", () => {
  const metadata = createSignInFailureMetadata("  MEMBER@Example.Test ");

  assert.deepEqual(metadata, {
    email: "member@example.test",
    failure_category: "authentication_failed",
    authentication_method: "password",
  });
  assert.deepEqual(Object.keys(metadata).sort(), [
    "authentication_method",
    "email",
    "failure_category",
  ]);
});
