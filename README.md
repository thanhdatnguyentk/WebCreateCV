# WebCreateCV

## Tổng quan
WebCreateCV là một ứng dụng web được thiết kế để giúp người dùng tạo và quản lý CV và portfolio của họ. Ứng dụng cung cấp giao diện thân thiện với người dùng để chọn mẫu, tùy chỉnh nội dung và xem trước kết quả cuối cùng.

## Tính năng
- **Chọn mẫu**: Chọn từ nhiều mẫu cho CV và portfolio.
- **Lọc theo thẻ**: Lọc các mẫu dựa trên thẻ để dễ dàng điều hướng.
- **Xem trước động**: Xem trước trực tiếp mẫu đã chọn với khả năng tùy chỉnh nội dung.
- **Thiết kế đáp ứng**: Ứng dụng được thiết kế để thân thiện với di động và đáp ứng.

## Cài đặt
1. Sao chép kho lưu trữ:
   ```bash
   git clone https://github.com/thanhdatnguyentk/WebCreateCV.git
   ```
2. Điều hướng đến thư mục dự án:
   ```bash
   cd WebCreateCV
   ```
3. Mở tệp `index.html` trong trình duyệt web của bạn để xem ứng dụng.

## Sử dụng
- **Chạy máy chủ phát triển**: 
  - Đảm bảo bạn đã thiết lập máy chủ cục bộ (ví dụ: sử dụng tiện ích mở rộng Live Server trong VS Code).
  - Mở dự án trong trình chỉnh sửa mã ưa thích của bạn và khởi động máy chủ.
  
- **Truy cập ứng dụng**: 
  - Điều hướng đến `http://localhost:PORT` (thay thế `PORT` bằng số cổng của máy chủ của bạn).

## Ghi chú phát triển
- **Chức năng lọc theo thẻ**: Được triển khai trong `pages/Home.js` để nâng cao trải nghiệm người dùng bằng cách cho phép người dùng lọc các mẫu dựa trên thẻ.
- **Quản lý mẫu**: Tệp `Templates.js` đã được sửa đổi để chấp nhận tham số mẫu cho nội dung iframe động.
- **Tương thích với Router**: Router đã được xác minh để hỗ trợ cả hai tuyến đường `/template/:id` và `/templatePage`.


## Giấy phép
Dự án này được cấp phép theo Giấy phép MIT. Xem tệp [LICENSE](LICENSE) để biết chi tiết.
