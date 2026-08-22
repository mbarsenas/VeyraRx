"use client";

import { useActionState } from "react";
import { enrollMember } from "./actions";

export default function EnrollPage() {
  const [state, formAction, isPending] = useActionState(enrollMember, null);

  return (
    <main className="signinWrap">
      <form className="signinCard" action={formAction}>
        <div className="brandMark big" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></div>
        <h1>Connect your member account</h1>
        <p>Your SmarteRX sign-in is active. Enter the one-time enrollment code associated with your member record.</p>

        <label htmlFor="code">Enrollment code</label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter enrollment code"
          required
        />

        {state?.error ? <p className="note" role="alert">{state.error}</p> : null}

        <button className="button primary full" type="submit" disabled={isPending}>
          {isPending ? "Connecting..." : "Connect member account"}
        </button>
        <a className="button secondary full" href="/signin">Return to sign in</a>
      </form>
    </main>
  );
}
