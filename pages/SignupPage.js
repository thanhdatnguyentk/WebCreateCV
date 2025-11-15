import { showAlert } from "../assets/js/components/alert.js";

export function setupSignupPage() {
  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form));

      // --- Logic đăng ký ---
      if (data.password !== data.confirm_password) {
        showAlert("Mật khẩu xác nhận không khớp!", 'error');
        return;
      }

      // Giả lập API: Lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Kiểm tra xem username hoặc email đã tồn tại chưa
      const userExists = users.some(
        (user) => user.username === data.username || user.email === data.email
      );

      if (userExists) {
        showAlert("Tên người dùng hoặc email đã tồn tại!", 'error');
        return;
      }

      users.push({ username: data.username, email: data.email, password: data.password });
      localStorage.setItem("users", JSON.stringify(users));

      showAlert("Đăng ký thành công! Vui lòng đăng nhập.", 'success');
      window.location.hash = "/login"; // Chuyển hướng đến trang đăng nhập
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
                    <div class="input-wrapper">
                        <input type="text" name="username" placeholder="Username" required>
                        <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                    </div>
                    <div class="input-wrapper">
                        <input type="email" name="email" placeholder="Email" required>
                        <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                    </div>
                </div>
                <div class="input-wrapper">
                    <input type="password" name="password" placeholder="Password" required>
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>
                </div>
                <div class="input-wrapper">
                    <input type="password" name="confirm_password" placeholder="Confirm Password" required>
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>
                </div>
              <button type="submit" class="continue-btn">Continue</button>
          </form>
          <div class="login-link">Already have account? Click <a href="#/login">Login</a></div>
      </div>
    </main>
  `;
}
