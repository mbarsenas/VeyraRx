"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { resetPassword } from "./actions";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, null);
  return <main className="signinWrap"><form className="signinCard" action={action}>
    <h1>Choose a new password</h1><p>Your new password must be at least 8 characters.</p>
    <input type="hidden" name="token" value={token} />
    <label htmlFor="password">New password</label><input id="password" name="password" type="password" minLength={8} required />
    {state?.error ? <p className="note" role="alert">{state.error}</p> : null}
    <button className="button primary full" disabled={pending}>{pending ? "Updating..." : "Update password"}</button>
  </form></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="signinWrap"><div className="signinCard"><p>Loading secure reset form...</p></div></main>}><ResetPasswordForm /></Suspense>;
}
