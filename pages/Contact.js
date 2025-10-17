export default function AboutPage() {
  return `
      <div class="container Contact-Container">

    <h1>Liên hệ với chúng tôi</h1>
    <p class="contact-intro">
      Hãy để lại lời nhắn — đội ngũ WebCreateCV sẽ phản hồi bạn trong thời gian sớm nhất.
    </p>

    <div class="row contact-row">
      <div class="col-8 contact-form">
        <form action="#" method="POST" class="Contact-Form">
          <div class="form-group">
            <label for="name">Họ và tên</label>
            <input type="text" id="name" name="name" placeholder="Nhập họ tên của bạn" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
          </div>

          <div class="form-group">
            <label for="subject">Chủ đề</label>
            <input type="text" id="subject" name="subject" placeholder="Nhập chủ đề liên hệ" required>
          </div>

          <div class="form-group">
            <label for="message">Nội dung</label>
            <textarea id="message" name="message" rows="6" placeholder="Nhập tin nhắn của bạn..." required></textarea>
          </div>

          <button type="submit" class="btn-primary">Gửi tin nhắn</button>
        </form>
      </div>

      <div class="col-7 contact-info">
        <h2>Thông tin liên hệ</h2>
        <p><strong>Địa chỉ:</strong> Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh</p>
        <p><strong>Email:</strong> support@webcreatecv.com</p>
        <p><strong>Hotline:</strong> (+84) 909 123 456</p>

        <div class="social-links">
          <h3>Kết nối với chúng tôi</h3>
          <div class="row">
            <div class="col-3"><a href="#"><img src="./assets/img/icons/facebook.svg" alt="Facebook"></a></div>
            <div class="col-3"><a href="#"><img src="./assets/img/icons/twitter.svg" alt="Twitter"></a></div>
            <div class="col-3"><a href="#"><img src="./assets/img/icons/linkedin.svg" alt="LinkedIn"></a></div>
            <div class="col-3"><a href="#"><img src="./assets/img/icons/github.svg" alt="GitHub"></a></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row contact-map">
      <div class="col-15">
        <h2>Bản đồ</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.490244141894!2d106.67998347474473!3d10.773374459282025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f411e85b10b%3A0x49c9c1a6da9a4c3f!2zTmjDoCBWxINuIENoxqFuZyBWxINuIFRo4buDIGdpw6FvIFBoxrDGoW5n!5e0!3m2!1svi!2s!4v1700000000000"
          width="100%" height="400" style="border:0;" allowfullscreen loading="lazy">
        </iframe>
      </div>
    </div>

  </div>

  `;
}
