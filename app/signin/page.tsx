export default function SignIn() {
  return <main className="signinWrap">
    <div className="signinCard"><div className="brandMark big" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></div>
    <h1>Welcome back</h1><p>Sign in to manage prescriptions, benefits and orders.</p>
    <label>Email or username</label><input placeholder="you@example.com" />
    <label>Password</label><input type="password" placeholder="Password" />
    <button className="button primary full">Sign in</button>
    <button className="textButton centeredBtn">Forgot username or password?</button>
    <hr/><p className="smallCenter">New to VeyraRx?</p><button className="button secondary full">Create account</button>
    <small className="note">Prototype authentication screen. No credentials are stored.</small></div>
  </main>
}
