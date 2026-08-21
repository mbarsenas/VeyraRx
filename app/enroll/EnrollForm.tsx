"use client";

import { useActionState } from "react";
import { submitEnrollment, type EnrollmentActionState } from "@/app/enroll/actions";

const initialState: EnrollmentActionState = { ok: false, message: "" };

export default function EnrollForm() {
  const [state, action, pending] = useActionState(submitEnrollment, initialState);

  return (
    <form action={action} className="authCard" style={{ maxWidth: 520, margin: "48px auto" }}>
      <span className="eyebrow">Member enrollment</span>
      <h1>Link your VeyraRx benefits</h1>
      <p className="railText">
        Enter the one-time enrollment code supplied by your plan or benefits administrator.
      </p>

      <label htmlFor="code">Enrollment code</label>
      <input
        id="code"
        name="code"
        autoComplete="one-time-code"
        required
        disabled={pending}
        style={{ textTransform: "uppercase" }}
      />

      <button className="button primary" type="submit" disabled={pending} style={{ marginTop: 18 }}>
        {pending ? "Verifying..." : "Verify and continue"}
      </button>

      {state.message && (
        <p className="railText" role="status" style={{ marginTop: 14 }}>
          {state.message}
        </p>
      )}
    </form>
  );
}
