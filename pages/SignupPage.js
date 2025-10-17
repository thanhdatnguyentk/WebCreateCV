export function setupSignupPage() {
  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const data = Object.fromEntries(new FormData(form));
      console.log("Signup data:", data);
      alert("Đăng ký thành công (xem console log)!");
      window.location.hash = "/login";
    });
  }
}

export default function SignupPage() {
  setTimeout(setupSignupPage, 0);

  return `
    <main class="signup-bg">
      <div class="signup-container">
          <h2>Sign up</h2>
          <button class="google-btn">
              <img src="./assets/images/google.svg" alt="Google logo" class="google-logo">
              Continue with google
          </button>
          <div class="divider"><hr><span>OR</span><hr></div>
          <form id="signup-form">
              <div class="input-row">
                  <input type="text" name="username" placeholder="Username" required>
                  <input type="email" name="email" placeholder="Email" required>
              </div>
              <input type="password" name="password" placeholder="Password" required>
              <button type="submit" class="continue-btn">Continue</button>
          </form>
          <div class="login-link">Already have account? Click <a href="#/login">Login</a></div>
      </div>
    </main>
  `;
}