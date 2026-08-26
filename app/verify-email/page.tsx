"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendVerificationCode, verifyEmailCode } from "./actions";

function VerifyEmailForm() {
  const initialEmail = useSearchParams().get("email") ?? "";
  const [sendState, sendAction, sending] = useActionState(sendVerificationCode, null);
  const [verifyState, verifyAction, verifying] = useActionState(verifyEmailCode, null);
  return <main className="signinWrap"><div className="signinCard">
    <h1>Verify your email</h1>
    <p>Enter the verification code sent to your email before accessing member information.</p>
    <form action={verifyAction}>
      <label htmlFor="email">Email address</label><input id="email" name="email" type="email" defaultValue={initialEmail} required />
      <label htmlFor="verificationCode">Verification code</label><input id="verificationCode" name="verificationCode" inputMode="numeric" autoComplete="one-time-code" required />
      {verifyState?.error ? <p className="note" role="alert">{verifyState.error}</p> : null}
      <button className="button primary full" disabled={verifying}>{verifying ? "Verifying..." : "Verify email"}</button>
    </form>
    <form action={sendAction} style={{ marginTop: "12px" }}>
      <input type="hidden" name="email" value={initialEmail} />
      {sendState?.message ? <p className="note" role="status">{sendState.message}</p> : null}
      {sendState?.error ? <p className="note" role="alert">{sendState.error}</p> : null}
      <button className="button secondary full" disabled={sending}>{sending ? "Sending..." : "Send another code"}</button>
    </form>
    <Link className="textButton centeredBtn" href="/signin">Back to sign in</Link>
  </div></main>;
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="signinWrap"><div className="signinCard"><p>Loading verification...</p></div></main>}><VerifyEmailForm /></Suspense>;
}
