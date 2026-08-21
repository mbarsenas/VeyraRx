"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInWithEmail } from "./actions";

export default function SignIn() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return <main className="signinWrap">
    <form className="signinCard" action={formAction}>
      <div className="brandMark big" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></div>
      <h1>Welcome back</h1><p>Sign in to manage prescriptions, benefits and orders.</p>
      <label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="you@example.com" required />
      <label htmlFor="password">Password</label><input id="password" name="password" type="password" placeholder="Password" required />
      {state?.error ? <p className="note" role="alert">{state.error}</p> : null}
      <button className="button primary full" type="submit" disabled={isPending}>{isPending ? "Signing in..." : "Sign in"}</button>
      <Link className="textButton centeredBtn" href="/forgot-password">Forgot password?</Link>
      <hr/><p className="smallCenter">New to VeyraRx?</p><Link className="button secondary full" href="/signup">Create account</Link>
    </form>
  </main>;
}
