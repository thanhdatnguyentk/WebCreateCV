import { showAlert } from "./alert.js";

export function setupHeader() {
  const avatar = document.getElementById("profile-avatar-btn");
  const dropdown = document.getElementById("profile-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  // Xử lý đóng/mở dropdown menu
  if (avatar && dropdown) {
    avatar.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
      dropdown.classList.toggle("active");
    });

    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (dropdown.classList.contains('active') && !dropdown.contains(e.target) && !avatar.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });
  }

  // Xử lý sự kiện đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("authToken");
      showAlert("Bạn đã đăng xuất.", 'info');
      window.location.hash = "/login";
    });
  }
}


export default function Header() {
  const isLoggedIn = !!sessionStorage.getItem("authToken");
  const userEmail = sessionStorage.getItem("authToken");
  const username = userEmail ? userEmail.split("@")[0] : "User";

  // Lấy avatar từ profile của người dùng, nếu không có thì dùng ảnh mặc định
  const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
  const userProfile = isLoggedIn ? allProfiles[userEmail] : {};
  const userAvatar = (userProfile && userProfile.avatarUrl) 
    ? userProfile.avatarUrl 
    : './assets/images/icons/profile.svg';

  // Lấy hash hiện tại để xác định trang active
  const currentHash = window.location.hash || '#/';

  return `
    <div class="navbar-container">
        <div class="navbar">
            <div class="navbar-logo">
                <a href="#/">
                    <img src="./assets/images/uit.png" alt="Logo" class="uit-logo" style="height: 36px;">
                </a>
            </div>
            <div class="navbar-links">
                <a href="#/homePage" class="${currentHash === '#/homePage' ? 'active' : ''}">Library</a>
                <a href="#/contact" class="${currentHash === '#/contact' ? 'active' : ''}">Contact</a>

            </div>
            <div class="navbar-actions">
            ${isLoggedIn
              ? `
              <div class="profile-menu-container">
                <img src="${userAvatar}" alt="User Avatar" class="profile-avatar" id="profile-avatar-btn">
                <div class="profile-dropdown" id="profile-dropdown">
                  <div class="dropdown-header">
                    <img src="${userAvatar}" alt="User Avatar" class="dropdown-avatar">
                    <div class="user-info">
                      <span class="username">${username}</span>
                      <span class="email">${userEmail}</span>
                    </div>
                  </div>
                  <a href="#/profile" class="dropdown-item"><img src="./assets/images/icons/account.svg" alt="profile icon"><span>Profile</span></a>
                  <a href="#" id="logout-btn" class="dropdown-item"><img src="./assets/images/icons/logout.svg" alt="logout icon"><span>Logout</span></a>
                </div>
              </div>`
              : `
              <a href="#/login" class="btn btn-login">Log in</a>
              <a href="#/signup" class="btn btn-signup">Sign up</a>`
            }
            </div>
        </div>
    </div>
  `;
}
