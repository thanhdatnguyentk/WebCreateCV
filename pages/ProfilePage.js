import { showAlert } from "../assets/js/components/alert.js";

/**
 * Gắn sự kiện và xử lý logic cho trang Profile.
 */
export function setupProfilePage() {
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    const userEmail = sessionStorage.getItem('authToken');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarUploadInput = document.getElementById('avatar-upload');

    // Nếu chưa đăng nhập, chuyển về trang login
    if (!userEmail) {
        showAlert('Vui lòng đăng nhập để xem trang cá nhân.', 'warning');
        window.location.hash = '/login';
        return;
    }

    // Lấy tất cả profile từ localStorage
    const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const userProfile = allProfiles[userEmail] || {};

    // --- Xử lý Avatar ---
    if (avatarUploadInput) {
        // Hiển thị avatar đã lưu
        avatarPreview.src = userProfile.avatarUpload || './assets/images/icons/profile.svg';

        // Cập nhật preview khi người dùng chọn ảnh mới
        avatarUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    avatarPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Xử lý Form thông tin cá nhân ---
    if (profileForm) {
        // Điền thông tin đã lưu vào form
        profileForm.elements['email'].value = userEmail; 
        profileForm.elements['fullName'].value = userProfile.fullName || '';
        profileForm.elements['jobTitle'].value = userProfile.jobTitle || '';
        profileForm.elements['phone'].value = userProfile.phone || '';
        profileForm.elements['address'].value = userProfile.address || '';
        profileForm.elements['ngaySinh'].value = userProfile.ngaySinh || '';
        profileForm.elements['gioiTinh'].value = userProfile.gioiTinh || '';

        const gioiTinhSelect = profileForm.elements['gioiTinh'];
        if (gioiTinhSelect) {
            gioiTinhSelect.addEventListener('change', () => gioiTinhSelect.blur());
        }
        
        // Xử lý khi submit form
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(profileForm));
            
            // Cập nhật profile cho user hiện tại
            allProfiles[userEmail] = {
                ...userProfile, // Giữ lại các giá trị cũ
                ...formData, // Ghi đè bằng giá trị mới từ form
                avatarUpload: avatarPreview.src // Lưu avatar dưới dạng data URL
            };

            // Lưu lại vào localStorage
            localStorage.setItem('userProfiles', JSON.stringify(allProfiles));

            showAlert('Cập nhật thông tin thành công!', 'success');
            setTimeout(() => {
                window.location.reload(); // Tải lại để header và trang cập nhật
            }, 1500); 
        });
    }

    // --- Xử lý Form đổi mật khẩu ---
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(passwordForm));

            if (data.newPassword !== data.confirmPassword) {
                showAlert('Mật khẩu mới không khớp. Vui lòng nhập lại.', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = users.findIndex(user => user.email === userEmail);

            if (userIndex === -1) {
                showAlert('Lỗi: Không tìm thấy người dùng.', 'error');
                return;
            }

            if (users[userIndex].password !== data.currentPassword) {
                showAlert('Mật khẩu hiện tại không đúng.', 'error');
                return;
            }

            // Cập nhật mật khẩu mới
            users[userIndex].password = data.newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            showAlert('Đổi mật khẩu thành công!', 'success');
            passwordForm.reset(); // Xóa các trường trong form
        });
    }
}

/**
 * Component ProfilePage: Trả về HTML cho trang Profile.
 */
export default function ProfilePage() {

    return `
        <main class="container">
            <div class="profile-page-wrapper">
                <!-- Avatar Section -->
                <div class="profile-avatar-container">
                    <label for="avatar-upload" class="avatar-upload-label">
                        <img src="./assets/images/icons/profile.svg" alt="Avatar Preview" id="avatar-preview" class="profile-avatar-preview">
                        <div class="avatar-hover-overlay">
                            <span>📷<br>Change</span>
                        </div>
                    </label>
                    <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                </div>

                <div class="profile-forms-grid">
                    <!-- Personal Info Section -->
                    <div class="profile-form-container">
                        <h3>Thông Tin Cá Nhân</h3>
                        <form id="profile-form" class="profile-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="fullName">Họ và Tên</label>
                                    <input type="text" id="fullName" name="fullName" placeholder="Nhập họ và tên" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="jobTitle">Chức danh</label>
                                    <input type="text" id="jobTitle" name="jobTitle" placeholder="VD: Lập trình viên...">
                                </div>
                                <div class="form-group">
                                    <label for="phone">Số điện thoại</label>
                                    <input type="tel" id="phone" name="phone" placeholder="Nhập số điện thoại">
                                </div>
                                <div class="form-group">
                                    <label for="address">Địa chỉ</label>
                                    <input type="text" id="address" name="address" placeholder="VD: Quận 1, TP. HCM">
                                </div>
                                <div class="form-group">
                                    <label for="ngaySinh">Ngày sinh</label>
                                    <input type="date" id="ngaySinh" name="ngaySinh">
                                </div>
                                <div class="form-group">
                                    <label for="gioiTinh">Giới tính</label>
                                    <div class="select-wrapper">
                                        <select id="gioiTinh" name="gioiTinh">
                                            <option value="">-- Chọn giới tính --</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                        <img src="./assets/images/icons/dropdown.svg" alt="dropdown icon" class="select-arrow">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-slide btn-slide--bl">Lưu Thông Tin</button>
                        </form>
                    </div>

                    <!-- Change Password Section -->
                    <div class="profile-form-container">
                        <h3>Đổi Mật Khẩu</h3>
                        <form id="password-form" class="profile-form">
                            <div class="form-group">
                                <label for="currentPassword">Mật khẩu hiện tại</label>
                                <input type="password" id="currentPassword" name="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">Mật khẩu mới</label>
                                <input type="password" id="newPassword" name="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Xác nhận mật khẩu mới</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-slide btn-slide--gry">Đổi Mật Khẩu</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    `;
}
