document.addEventListener('DOMContentLoaded', (event) => {
    const downloadBtn = document.getElementById('download-btn');
    const profilePicInput = document.getElementById('profile-pic-upload');
    const profilePicImg = document.getElementById('profile-pic-img');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Use the browser's print functionality to save as PDF
            window.print();
        });
    }

    if (profilePicInput && profilePicImg) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicImg.src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });
    }
});
