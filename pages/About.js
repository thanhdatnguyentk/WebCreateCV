// about.js

// Cấu hình dữ liệu cho từng category
const portfolioData = {
  edit: {
    title: "Edit",
    folder: "Edit",
    items: [
      { title: "Video Editor Portfolio", subtitle: "Professional Video Editing", tag: "" },
      { title: "Photo Editor Showcase", subtitle: "Creative Photo Editing", tag: "Premium" },
      { title: "Content Editor CV", subtitle: "Editorial & Content Creation", tag: "Premium" }
    ]
  },
  coder: {
    title: "Coder",
    folder: "Coder",
    items: [
      { title: "Full Stack Developer", subtitle: "Web Development Expert", tag: "Premium" },
      { title: "Frontend Developer", subtitle: "UI/UX Implementation", tag: "" },
      { title: "Backend Developer", subtitle: "Server & Database Specialist", tag: "Premium" }
    ]
  },
  design: {
    title: "Art & Design",
    folder: "Artist & Designer",
    items: [
      { title: "Graphic Designer", subtitle: "Visual Design Expert", tag: "Premium" },
      { title: "UI/UX Designer", subtitle: "User Experience Designer", tag: "Premium" },
      { title: "Digital Artist", subtitle: "Creative Digital Arts", tag: "" },
      { title: "Photographer", subtitle: "Professional Photography", tag: "" }
    ]
  },
  fashion: {
    title: "Fashion",
    folder: "Fashion",
    items: [
      { title: "Fashion Designer", subtitle: "Trendy Fashion Design", tag: "Premium" },
      { title: "Style Consultant", subtitle: "Personal Styling Expert", tag: "Premium" },
      { title: "Fashion Photographer", subtitle: "Fashion Photography", tag: "Premium" }
    ]
  }
};

export default function AboutPage() {
  // Tính tổng số templates
  const totalTemplates = Object.values(portfolioData).reduce((sum, category) => sum + category.items.length, 0);
  
  // Tạo HTML cho các sections
  const sectionsHTML = Object.entries(portfolioData).map(([key, category]) => {
    const cardsHTML = category.items.map((item, index) => {
      const imagePath = `/HoangAnh/Portfolio/${category.folder}/img${index + 1}.jpg`;
      return createCard(item.title, item.subtitle, imagePath, item.tag);
    }).join('');

    return `
      <section class="portfolio-section" data-category="${key}">
        <h2>${category.title}</h2>
        <div class="portfolio-grid">
          ${cardsHTML}
        </div>
      </section>
    `;
  }).join('');

  return `
    <main class="gioithieu-page">
      <section class="hero-slider">
        <div class="slider-wrapper">
          <div class="slide active" style="background-image: url('assets/images/HoangAnh/banner.jpg');"></div>
          <div class="slide" style="background-image: url('assets/images/HoangAnh/Flat-Design-Of-Portfolio-Banner-Creative-Template-square.jpg');"></div>
          <div class="slide" style="background-image: url('assets/images/HoangAnh/gradient-portfolio-banner-template_23-2149225563.jpg');"></div>
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
            <label class="filter-type ">
            <span >Portfolio</span>
              <input type="checkbox" checked disabled>
                </label>
            <label filter-type ">
            <span >Blog</span>
              <input type="checkbox" disabled>
            </label>
            <label filter-type ">
            <span >Scheduling</span>
              <input type="checkbox" disabled>
            </label>
          </div>
        </aside>

        <div class="portfolio-content">
          <h2>Popular Designs Templates (${totalTemplates})</h2>
          ${sectionsHTML}
        </div>
      </section>
    </main>
  `;
}
function createCard(title, subtitle, image, tag) {
  return `
    <div class="image-wrapper">
      <div class="portfolio-card">
        <img src="assets/images/${image}" alt="${title}">
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
      if (filterValue === 'all' || category === filterValue) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
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
