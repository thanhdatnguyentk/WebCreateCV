// about.js

// 1. HÀM RENDER DỮ LIỆU TỪ JSON
async function renderAboutTemplates() {
  const res = await fetch('assets/js/templates-manifest.json');
  const templates = await res.json();
  
  // Category mapping: đổi tên theo sidebar filter (edit/coder/design/fashion)
  const catMap = {
    edit: ["Edit", "Video", "Photo", "Content"],
    coder: ["Coder", "Developer", "Engineer", "Full Stack", "Frontend", "Backend", "Web", "AI", "Game"],
    design: ["Art", "Design", "Graphic", "Artist", "UI/UX", "Photographer", "Digital"],
    fashion: ["Fashion", "Style"],
  };

  // Tạo hàm gán category cho từng template
  function getCategoryBtnKey(template) {
    const lowerName = template.name.toLowerCase();
    // Ưu tiên map category trường manifest nếu trùng
    if (template.category && catMap[template.category.toLowerCase()]) {
      return template.category.toLowerCase();
    }
    // Không thì dựa theo keyword trong name
    for (const key in catMap) {
      if (catMap[key].some(w => lowerName.includes(w.toLowerCase()))) {
        return key;
      }
    }
    return 'other'; // Sẽ không được hiển thị nếu không khớp
  }

  // Tạo data group templates cho từng nhánh
  const group = {};
  Object.keys(catMap).forEach(k => (group[k] = []));

  templates.forEach(tpl => {
    const cat = getCategoryBtnKey(tpl);
    if (group[cat]) group[cat].push(tpl);
  });

  // Render sections HTML giống code cũ nhưng dựa group mới
  const sectionsHTML = Object.entries(group).map(([key, arr]) => {
    if (!arr.length) return '';
    const cardsHTML = arr.map(
      tpl => createCard(tpl.name, tpl.tags?.join(', ')||'', tpl.preview, tpl.tags?.[0], tpl.id, tpl.type)
    ).join('');
    return `
      <section class="portfolio-section" data-category="${key}">
        <h2>${key==='edit'? 'Edit': key==='coder'? 'Coder': key==='design'? 'Art & Design': 'Fashion'}</h2>
        <div class="portfolio-grid">
          ${cardsHTML}
        </div>
      </section>
    `;
  }).join('');

  const totalTemplates = templates.length;
  // Gắn HTML vào container
  const contentEl = document.querySelector('.portfolio-content');
  if (contentEl) {
    contentEl.innerHTML = `
      <h2>Popular Designs Templates (${totalTemplates})</h2>
      ${sectionsHTML}
    `;
  }
}

// 2. HÀM TẠO CARD (CÓ THÊM data-type)
function createCard(title, subtitle, preview, tag, id, type) {
  return `
    <div class="image-wrapper" data-type="${type || 'other'}">
      <a href="#/template/${id}" class="portfolio-card-link">
        <div class="portfolio-card">
          <img src="${preview}" alt="${title}">
          <div class="card-content">
            <h3>${title}</h3>
            <p>${subtitle}</p>
            ${tag ? `<span class="tag">${tag}</span>` : ""}
          </div>
        </div>
      </a>
    </div>
  `;
}

// 3. HÀM EXPORT CHÍNH (TRẢ VỀ HTML SƯỜN)
export default function AboutPage() {
  return `
    <main class="gioithieu-page">
      <section class="hero-slider">
        <div class="slider-wrapper">
          <div class="slide active" style="background-image: url('assets/images/HoangAnh/banner.jpg');"></div>
          <div class="slide" style="background-image: url('../assets/images/HoangAnh/Flat-Design-Of-Portfolio-Banner-Creative-Template-square.jpg');"></div>
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
            <button class="filter-btn active" data-type="all">All Types</button>
            <button class="filter-btn" data-type="Portfolio">Portfolio</button>
            <button class="filter-btn" data-type="CV">CV</button>
          </div>
        </aside>

        <div class="portfolio-content">
          </div>
      </section>
    </main>
  `;
}

// 4. HÀM SETUP (GẮN EVENT VÀ CHẠY SLIDER)
export function initPortfolioPage() {
  
  // Lấy tham chiếu đến CẢ HAI nhóm nút
  const topicButtons = document.querySelectorAll('.filter-btn[data-filter]');
  const typeButtons = document.querySelectorAll('.filter-btn[data-type]');

  /**
   * Hàm lọc TỔNG HỢP
   */
  function applyAllFilters() {
    const activeTopic = document.querySelector('.filter-btn[data-filter].active')?.dataset.filter || 'all';
    const activeType = document.querySelector('.filter-btn[data-type].active')?.dataset.type || 'all';

    document.querySelectorAll('.portfolio-section').forEach(section => {
      const sectionCategory = section.dataset.category;
      const isTopicMatch = (activeTopic === 'all' || sectionCategory === activeTopic);

      // Ẩn/Hiện section (Topic)
      section.classList.toggle('hidden', !isTopicMatch);

      // Lọc card (Type) bên trong section
      section.querySelectorAll('.image-wrapper').forEach(card => {
        const cardType = card.dataset.type;
        const isTypeMatch = (activeType === 'all' || cardType === activeType);
        
        // Ẩn/Hiện card (Type)
        card.classList.toggle('hidden', !isTypeMatch);
      });
    });
  }

  // --- Gắn sự kiện click ---

  // 1. Gắn sự kiện cho các nút Topic
  topicButtons.forEach(button => {
    button.addEventListener('click', () => {
      topicButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyAllFilters();
    });
  });

  // 2. Gắn sự kiện cho các nút Type
  typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      typeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyAllFilters();
    });
  });

  // --- Chạy lần đầu khi tải trang ---
  renderAboutTemplates().then(() => {
    applyAllFilters();
  }).catch(err => {
    console.error("Lỗi khi render template:", err);
    // Xử lý lỗi, ví dụ hiển thị thông báo
    const contentEl = document.querySelector('.portfolio-content');
    if (contentEl) contentEl.innerHTML = "<h2>Không thể tải được template. Vui lòng thử lại sau.</h2>";
  });

  // --- Code Slider ---
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const numSlides = slides.length;

  if (numSlides > 0) { // Chỉ chạy slider nếu có slide
    function showSlide(slideIndex) {
      if (slideIndex >= numSlides) currentSlide = 0;
      else if (slideIndex < 0) currentSlide = numSlides - 1;
      else currentSlide = slideIndex;

      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    let autoPlayInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    document.querySelector('.slider-nav.prev').addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoPlay(); });
    document.querySelector('.slider-nav.next').addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoPlay(); });
    dots.forEach(dot => dot.addEventListener('click', e => { showSlide(parseInt(e.target.dataset.slide)); resetAutoPlay(); }));

    showSlide(0);
  }
}