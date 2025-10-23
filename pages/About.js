export default function AboutPage() {
  return `
  <main class="gioithieu-page">
    <section class="hero">
      <h1>Khám phá mẫu Portfolio chuyên nghiệp</h1>
      <p>Các mẫu responsive, dễ dùng và tùy chỉnh cho mọi ngành nghề.</p>
      <button class="btn-primary btn-animated btn-animated-1">
        <svg>
          <rect x="0" y="0" fill="none" width="100%" height="100%"/>
        </svg>
        Bắt đầu ngay
      </button>
    </section>

    <section class="portfolio-section">
      <h2>Edit</h2>
      <div class="portfolio-grid">
        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../../assets/images/HoangAnh/img1.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>

        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../../assets/images/HoangAnh/img2.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>

        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../../assets/images/HoangAnh/img3.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>  
      </div>

      <h2>Coder</h2>
      <div class="portfolio-grid">
        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../assets/images/HoangAnh/img1.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>

        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../assets/images/HoangAnh/img3.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>

        <div class="image-wrapper">
            <div class="portfolio-card">
                <img src="../assets/images/HoangAnh/img2.jpg" alt="John Alwin">
                <div class="card-content">
                    <h3>John Alwin</h3>
                    <p>Painter Artist</p>
                    <span class="tag">Premium</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  </main>
`;
}

function createCard(title, subtitle, image, tag) {
return `
  <div class="portfolio-card">
    <img src="./assets/${image}" alt="${title}">
    <div class="card-content">
      <h3>${title}</h3>
      <p>${subtitle}</p>
      ${tag ? `<span class="tag">${tag}</span>` : ""}
    </div>
  </div>
`;
}
