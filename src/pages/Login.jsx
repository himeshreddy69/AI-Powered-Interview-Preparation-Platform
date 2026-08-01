import "./../assets/styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>New to DEBIC?</h1>

        <ul>
          <li>✓ Practice AI-powered mock interviews.</li>

          <li>✓ Get personalized interview questions based on your resume.</li>

          <li>✓ Prepare for top companies with company-specific interview rounds.</li>

          <li>✓ Track your interview performance with AI feedback.</li>
        </ul>

        <button className="register-btn">
          Create Free Account
        </button>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="illustration"
          className="login-image"
        />
      </div>

      <div className="right-panel">
        <h1>Login</h1>

        <label>Email ID / Username</label>

        <input
          type="text"
          placeholder="Enter Email ID / Username"
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter Password"
        />

        <a href="/">Forgot Password?</a>

        <button className="login-btn">
          Login
        </button>

        <p className="otp">
          Use OTP to Login
        </p>

        <div className="divider">
          <span>Or</span>
        </div>

        <button className="google-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;