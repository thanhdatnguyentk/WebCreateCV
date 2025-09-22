#!/bin/bash

# Tạo thư mục gốc
mkdir -p ./assets/css
mkdir -p ./assets/js/components
mkdir -p ./pages

# Tạo file
touch ./index.html
touch ./assets/css/{base.css,layout.css,components.css,pages.css}
touch ./assets/js/{app.js,router.js,utils.js,api.js}
touch ./assets/js/components/{header.js,footer.js,modal.js}
touch ./pages/{home.html,about.html,contact.html}

echo "✅ Cấu trúc dự án đã được tạo thành công!"
