/**
 * Hiển thị một thông báo (alert notification).
 * @param {string} message - Nội dung thông báo.
 * @param {string} [type='info'] - Loại thông báo ('success', 'error', 'warning', 'info').
 * @param {number} [duration=3000] - Thời gian hiển thị (ms).
 */
export function showAlert(message, type = 'info', duration = 1000000) {
    let alertContainer = document.getElementById('alert-container');

    // Nếu chưa có container, tạo và thêm vào body
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.appendChild(alertContainer);
    }

    const alert = document.createElement('div');
    alert.className = `custom-alert alert--${type}`;

    // Icons cho từng loại thông báo
    const icons = {
        success: `<img src="./assets/images/icons/success.png" alt="Success">`,
        error: `<img src="./assets/images/icons/error.png" alt="Error">`,
        warning: `<img src="./assets/images/icons/warning.png" alt="Warning">`,
        info: `<img src="./assets/images/icons/info.png" alt="Info">`
    };

    alert.innerHTML = `
        <div class="alert__icon">${icons[type] || icons['info']}</div>
        <div class="alert__body">
            <p class="alert__msg">${message}</p>
        </div>
        <div class="alert__close">&times;</div>
    `;

    alertContainer.appendChild(alert);

    // Animation: hiện ra
    setTimeout(() => {
        alert.classList.add('alert--visible');
    }, 10);

    // Tự động ẩn sau một khoảng thời gian
    const hideTimeout = setTimeout(() => {
        hideAlert(alert);
    }, duration);

    // Đóng khi click vào nút close
    alert.querySelector('.alert__close').addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideAlert(alert);
    });

    function hideAlert(alertElement) {
        alertElement.classList.remove('alert--visible');
        // Xóa element khỏi DOM sau khi animation kết thúc
        alertElement.addEventListener('transitionend', () => {
            if (alertElement.parentElement) {
                alertElement.parentElement.removeChild(alertElement);
            }
        }, { once: true });
    }
}
