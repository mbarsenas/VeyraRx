import assert from "node:assert/strict";
import test from "node:test";
import { getMemberAccessDestination } from "../lib/auth/member-access";
import type { MemberSession } from "../lib/auth/session";

const verifiedSession: MemberSession = {
  memberId: "auth-user-a",
  email: "member-a@example.test",
  displayName: "Member A",
  emailVerified: true,
};

test("unauthenticated users are sent to sign in", () => {
  assert.equal(getMemberAccessDestination(null, false), "/signin");
});

test("unverified users are sent to email verification before enrollment or member access", () => {
  assert.equal(
    getMemberAccessDestination({ ...verifiedSession, emailVerified: false }, true),
    "/verify-email"
  );
  assert.equal(
    getMemberAccessDestination({ ...verifiedSession, emailVerified: false }, false),
    "/verify-email"
  );
});

test("verified but unlinked users are sent to enrollment", () => {
  assert.equal(getMemberAccessDestination(verifiedSession, false), "/enroll");
});

test("verified linked users can access the dashboard", () => {
  assert.equal(getMemberAccessDestination(verifiedSession, true), "/dashboard");
});
