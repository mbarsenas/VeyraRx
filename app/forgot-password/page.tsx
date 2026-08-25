"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return <main className="signinWrap"><form className="signinCard" action={action}>
    <h1>Reset your password</h1><p>Enter your account email and we will send a secure reset link.</p>
    <label htmlFor="email">Email address</label><input id="email" name="email" type="email" required />
    {state?.message ? <p className="note" role="status">{state.message}</p> : null}
    {state?.error ? <p className="note" role="alert">{state.error}</p> : null}
    <button className="button primary full" disabled={pending}>{pending ? "Sending..." : "Send reset link"}</button>
    <Link className="textButton centeredBtn" href="/signin">Back to sign in</Link>
  </form></main>;
}
