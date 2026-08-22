"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpWithEmail } from "./actions";
import BrandLogo from "@/components/BrandLogo";

export default function SignUp() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return <main className="signinWrap">
    <form className="signinCard" action={formAction}>
      <BrandLogo />
      <h1>Create your account</h1><p>Set up secure access to your SmarteRX member experience.</p>
      <label htmlFor="name">Full name</label><input id="name" name="name" type="text" required />
      <label htmlFor="email">Email address</label><input id="email" name="email" type="email" required />
      <label htmlFor="password">Password</label><input id="password" name="password" type="password" minLength={8} required />
      {state?.error ? <p className="note" role="alert">{state.error}</p> : null}
      <button className="button primary full" type="submit" disabled={isPending}>{isPending ? "Creating account..." : "Create account"}</button>
      <hr/><p className="smallCenter">Already have an account?</p><Link className="button secondary full" href="/signin">Sign in</Link>
    </form>
  </main>;
}
