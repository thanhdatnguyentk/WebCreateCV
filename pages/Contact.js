export default function ContactPage() {
  return `
      <div class="container Contact-Container">

    <h1>Contact Us</h1>
    <p class="contact-intro">
      Leave us a message — the WebCreateCV team will respond to you as soon as possible.
    </p>

    <div class="row Contact-card">
      <div class="col-8 contact-form ">
        <form action="#" method="POST" class="Contact-Form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your full name" required>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="Enter contact subject" required>
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6" placeholder="Enter your message..." required></textarea>
          </div>

          <button type="submit" class="btn-animated btn-animated-1 Contact-submit-btn">
            <svg>
               <rect x="0" y="0"  fill="none"  width="102%" height="102%"/>
            </svg>  
            Send Message
          </button>
        </form>
      </div>

      <div class="col-7 contact-info">
        <h2>Contact Information</h2>
        <p><strong>Address:</strong> Quarter 34, Linh Xuan Ward, Ho Chi Minh City</p>
        <p><strong>Email:</strong> support@webcreatecv.com</p>
        <p><strong>Hotline:</strong> (+84) 909 123 456</p>

        <div class="social-links">
          <p><strong>Connect with us:</strong></p>
          <div class="row">
            <div class="col-3"><a href="#"><img src="assets/images/icons/facebook.svg" alt="Facebook"></a></div>
            <div class="col-3"><a href="#"><img src="assets/images/icons/twitter-bird-svgrepo-com.svg" alt="Twitter"></a></div>
            <div class="col-3"><a href="#"><img src="assets/images/icons/linkedin-svgrepo-com.svg" alt="LinkedIn"></a></div>
            <div class="col-3"><a href="#"><img src="assets/images/icons/github.svg" alt="GitHub"></a></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row contact-map">
      <div class="col-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.490244141894!2d106.67998347474473!3d10.773374459282025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f411e85b10b%3A0x49c9c1a6da9a4c3f!2zTmjDoCBWxINuIENoxqFuZyBWxINuIFRo4buDIGdpw6FvIFBoxrDGoW5n!5e0!3m2!1svi!2s!4v1700000000000"
          width="100%" height="400" style="border:0;" allowfullscreen loading="lazy">
        </iframe>
      </div>
    </div>

  </div>

  `;
}
