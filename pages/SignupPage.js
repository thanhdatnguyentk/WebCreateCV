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
                  <input type="text" name="username" placeholder="Username" required>
                  <input type="email" name="email" placeholder="Email" required>
              </div>
              <input type="password" name="password" placeholder="Password" required>
              <input type="password" name="confirm_password" placeholder="Confirm Password" required>
              <button type="submit" class="continue-btn">Continue</button>
          </form>
          <div class="login-link">Already have account? Click <a href="#/login">Login</a></div>
      </div>
    </main>
  `;
}