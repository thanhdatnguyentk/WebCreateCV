import { showAlert } from "../assets/js/components/alert.js";

// Hàm này để gắn sự kiện sau khi HTML được render
export function setupLoginPage() {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Xử lý logic đăng nhập ở đây
      const formData = Object.fromEntries(new FormData(form));

      // Giả lập API: Lấy danh sách người dùng từ localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Tìm người dùng bằng username/email và kiểm tra mật khẩu
      const foundUser = users.find(
        (user) =>
          (user.username === formData.username || user.email === formData.username) &&
          user.password === formData.password
      );

      if (foundUser) {
        // Đăng nhập thành công, lưu token vào sessionStorage
        // (sessionStorage sẽ tự xóa khi đóng tab)
        sessionStorage.setItem("authToken", foundUser.email); // Dùng email làm "token" giả
        showAlert("Đăng nhập thành công!", 'success');
        // Chuyển hướng về trang chủ sau khi đăng nhập
        window.location.hash = "/homePage";
      } else {
        // Đăng nhập thất bại
        showAlert("Tên đăng nhập hoặc mật khẩu không chính xác.", 'error');
      }
    });
  }

  // --- Logic cho Quên Mật Khẩu ---
  const loginView = document.getElementById('login-view');
  const forgotPasswordView = document.getElementById('forgot-password-view');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const backToLoginLink = document.getElementById('back-to-login-link');
  const forgotPasswordForm = document.getElementById('forgot-password-form');

  // Chuyển sang form quên mật khẩu
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginView.style.display = 'none';
    forgotPasswordView.style.display = 'block';
  });

  // Quay lại form đăng nhập
  backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginView.style.display = 'block';
    forgotPasswordView.style.display = 'none';
  });

  // Xử lý submit form quên mật khẩu
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = forgotPasswordForm.querySelector('input[name="email"]').value;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(user => user.email === email);

    if (foundUser) {
      showAlert(`Mật khẩu của bạn là: "${foundUser.password}". Vui lòng đăng nhập lại.`, 'info', 4000);
    } else {
      showAlert("Không tìm thấy người dùng với email này.", 'error');
    }

    // Sau 4 giây, tự động quay lại màn hình đăng nhập
    setTimeout(() => {
      loginView.style.display = 'block';
      forgotPasswordView.style.display = 'none';
    }, 4000);
  });
}

export default function LoginPage() {
  // Gọi hàm setup sau khi component được render vào DOM
  setTimeout(setupLoginPage, 0);

  return `
    <main class="login-bg">
      <div class="login-container">
          <div id="login-view">
            <h2>Log in</h2>
            <button class="google-btn">
                <img src="./assets/images/google.svg" alt="Google logo" class="google-logo">
                Continue with google
            </button>
            <div class="divider"><hr><span>OR</span><hr></div>
            <form id="login-form">
                <div class="input-wrapper">
                    <input type="text" name="username" placeholder="Username/Email" required>
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                </div>
                <div class="input-wrapper">
                    <input type="password" name="password" placeholder="Password" required>
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path></svg>
                </div>
                <div class="forgot-password-link">
                  <a href="#" id="forgot-password-link">Forgot password?</a>
                </div>
                <button type="submit" class="continue-btn">Log in</button>
            </form>
            <div class="signup-link">Not having account yet? Click <a href="#/signup">Sign up</a></div>
          </div>

          <div id="forgot-password-view">
            <h2>Forgot Password</h2>
            <p class="forgot-password-intro">Enter your email to retrieve your password.</p>
            <form id="forgot-password-form">
                <div class="input-wrapper">
                    <input type="email" name="email" placeholder="Email" required>
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                </div>
                <button type="submit" class="continue-btn">Send Request</button>
            </form>
            <div class="signup-link">remember password? <a href="#" id="back-to-login-link">Sign in</a></div>
          </div>
      </div>
    </main>
  `;
}
