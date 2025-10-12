export default function AboutPage() {
  return `
  <main class="gioithieu-page">
    <section class="hero">
      <h1>Khám phá mẫu Portfolio chuyên nghiệp</h1>
      <p>Các mẫu responsive, dễ dùng và tùy chỉnh cho mọi ngành nghề.</p>
      <button class="btn-primary">Bắt đầu ngay</button>
    </section>

    <section class="portfolio-section">
      <h2>Edit</h2>
      <div class="portfolio-grid">
        ${createCard("John Alwin", "Painter Artist", "img1.jpg", "Premium")}
        ${createCard("Tarot Card Reader", "Tarot Expert", "img2.jpg", "Premium")}
        ${createCard("Cinematic Masterpiece", "Video Editor", "img3.jpg")}
      </div>

      <h2>Coder</h2>
      <div class="portfolio-grid">
        ${createCard("John Alwin", "Painter Artist", "img1.jpg", "Premium")}
        ${createCard("Tarot Card Reader", "Tarot Expert", "img2.jpg")}
        ${createCard("Cinematic Masterpiece", "Video Editor", "img3.jpg")}
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
