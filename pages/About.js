// about.js
export default function AboutPage() {
  return `
    <main class="gioithieu-page">
      <section class="hero-slider">
        <div class="slider-wrapper">
          <div class="slide active" style="background-image: url('/WebCreateCV/assets/images/HoangAnh/banner.jpg');"></div>
          <div class="slide" style="background-image: url('/WebCreateCV/assets/images/HoangAnh/Flat-Design-Of-Portfolio-Banner-Creative-Template-square.jpg');"></div>
          <div class="slide" style="background-image: url('/WebCreateCV/assets/images/HoangAnh/banner.jpg');"></div>
        </div>
        <button class="slider-nav prev">&lt;</button>
        <button class="slider-nav next">&gt;</button>
        <div class="slider-dots">
          <span class="dot active" data-slide="0"></span>
          <span class="dot" data-slide="1"></span>
          <span class="dot" data-slide="2"></span>
        </div>
      </section>

      <section class="portfolio-container">
        <aside class="portfolio-sidebar">
          <h3 class="sidebar-title">Topic</h3>
          <div class="filter-menu">
            <button class="filter-btn active" data-filter="all">All Templates</button>
            <button class="filter-btn" data-filter="edit">Edit</button>
            <button class="filter-btn" data-filter="coder">Coder</button>
            <button class="filter-btn" data-filter="design">Art & Design</button>
            <button class="filter-btn" data-filter="fashion">Fashion</button>
          </div>

          <h3 class="sidebar-title" style="margin-top: 20px;">Type</h3>
          <div class="filter-menu">
            <label class="filter-type"><input type="checkbox" checked disabled>Portfolio</label>
            <label class="filter-type"><input type="checkbox" disabled>Blog</label>
            <label class="filter-type"><input type="checkbox" disabled>Scheduling</label>
          </div>
        </aside>

        <div class="portfolio-content">
          <h2>Popular Designs Templates (29)</h2>

          <section class="portfolio-section" data-category="edit">
            <h2>Edit</h2>
            <div class="portfolio-grid">
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img1.jpg", "Premium")}
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img2.jpg", "Premium")}
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img3.jpg", "Premium")}
            </div>
          </section>

          <section class="portfolio-section" data-category="coder">
            <h2>Coder</h2>
            <div class="portfolio-grid">
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img1.jpg", "Premium")}
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img2.jpg", "Premium")}
              ${createCard("John Alwin", "Painter Artist", "HoangAnh/img3.jpg", "Premium")}
            </div>
          </section>
        </div>
      </section>
    </main>
  `;
}

// Hàm tạo card động
function createCard(title, subtitle, image, tag) {
  return `
    <div class="image-wrapper">
      <div class="portfolio-card">
        <img src="/WebCreateCV/assets/images/${image}" alt="${title}">
        <div class="card-content">
          <h3>${title}</h3>
          <p>${subtitle}</p>
          ${tag ? `<span class="tag">${tag}</span>` : ""}
        </div>
      </div>
    </div>
  `;
}
export function initPortfolioPage() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioSections = document.querySelectorAll('.portfolio-section');

  function filterPortfolio(filterValue) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    portfolioSections.forEach(section => {
      const category = section.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) section.classList.remove('hidden');
      else section.classList.add('hidden');
    });
  }

  filterButtons.forEach(button => {
    if (button.getAttribute('data-filter')) {
      button.addEventListener('click', e => filterPortfolio(e.target.getAttribute('data-filter')));
    }
  });

  filterPortfolio('all');

  // --- SLIDER ---
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const numSlides = slides.length;

  function showSlide(slideIndex) {
    if (slideIndex >= numSlides) currentSlide = 0;
    else if (slideIndex < 0) currentSlide = numSlides - 1;
    else currentSlide = slideIndex;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  document.querySelector('.slider-nav.prev').addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoPlay(); });
  document.querySelector('.slider-nav.next').addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoPlay(); });
  dots.forEach(dot => dot.addEventListener('click', e => { showSlide(parseInt(e.target.dataset.slide)); resetAutoPlay(); }));

  let autoPlayInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  showSlide(0);
}
