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
}

export default function LoginPage() {
  // Gọi hàm setup sau khi component được render vào DOM
  setTimeout(setupLoginPage, 0);

  return `
    <main class="login-bg">
      <div class="login-container">
          <h2>Log in</h2>
          <button class="google-btn">
              <img src="./assets/images/google.svg" alt="Google logo" class="google-logo">
              Continue with google
          </button>
          <div class="divider"><hr><span>OR</span><hr></div>
          <form id="login-form">
              <input type="text" name="username" placeholder="Username/Email" required>
              <input type="password" name="password" placeholder="Password" required>
              <button type="submit" class="continue-btn">Log in</button>
          </form>
          <div class="signup-link">Not having account yet? Click <a href="#/signup">Sign up</a></div>
      </div>
    </main>
  `;
}