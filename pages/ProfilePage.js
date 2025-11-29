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

    // If not logged in, redirect to login page
    if (!userEmail) {
        showAlert('Please log in to view your profile.', 'warning');
        window.location.hash = '/login';
        return;
    }

    // Lấy tất cả profile từ localStorage
    const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    const userProfile = allProfiles[userEmail] || {};

    // --- Xử lý Avatar ---
    if (avatarUploadInput) {
        // Hiển thị avatar đã lưu
        avatarPreview.src = userProfile.avatarUrl || './assets/images/icons/profile.svg';

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

            // Chỉ lưu avatar nếu nó là một data URL (ảnh mới tải lên)
            const newAvatarSrc = avatarPreview.src.startsWith('data:image') 
                ? avatarPreview.src 
                : userProfile.avatarUrl; // Giữ lại ảnh cũ nếu không thay đổi

            // Cập nhật profile cho user hiện tại
            allProfiles[userEmail] = {
                ...userProfile, ...formData,
                avatarUrl: newAvatarSrc
            };

            // Lưu lại vào localStorage
            localStorage.setItem('userProfiles', JSON.stringify(allProfiles));

            showAlert('Profile updated successfully!', 'success');
            setTimeout(() => {
                window.location.reload(); // Reload to update header and page
            }, 1500); 
        });
    }

    // --- Xử lý Form đổi mật khẩu ---
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(passwordForm));

            if (data.newPassword !== data.confirmPassword) {
                showAlert('New passwords do not match. Please try again.', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = users.findIndex(user => user.email === userEmail);

            if (userIndex === -1) {
                showAlert('Error: User not found.', 'error');
                return;
            }

            if (users[userIndex].password !== data.currentPassword) {
                showAlert('Current password is incorrect.', 'error');
                return;
            }

            // Update new password
            users[userIndex].password = data.newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            showAlert('Password changed successfully!', 'success');
            passwordForm.reset(); // Clear form fields
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
                        <h3>Personal Information</h3>
                        <form id="profile-form" class="profile-form">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="fullName">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" placeholder="Enter full name" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="jobTitle">Job Title</label>
                                    <input type="text" id="jobTitle" name="jobTitle" placeholder="E.g: Software Developer...">
                                </div>
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" placeholder="Enter phone number">
                                </div>
                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <input type="text" id="address" name="address" placeholder="E.g: District 1, HCMC">
                                </div>
                                <div class="form-group">
                                    <label for="ngaySinh">Date of Birth</label>
                                    <input type="date" id="ngaySinh" name="ngaySinh">
                                </div>
                                <div class="form-group">
                                    <label for="gioiTinh">Gender</label>
                                    <div class="select-wrapper">
                                        <select id="gioiTinh" name="gioiTinh">
                                            <option value="">-- Select gender --</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <img src="./assets/images/icons/dropdown.svg" alt="dropdown icon" class="select-arrow">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-slide btn-slide--bl">Save Information</button>
                        </form>
                    </div>

                    <!-- Change Password Section -->
                    <div class="profile-form-container">
                        <h3>Change Password</h3>
                        <form id="password-form" class="profile-form">
                            <div class="form-group">
                                <label for="currentPassword">Current Password</label>
                                <input type="password" id="currentPassword" name="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New Password</label>
                                <input type="password" id="newPassword" name="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-slide btn-slide--gry">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    `;
}
