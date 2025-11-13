// about.js

// 1. HÀM RENDER DỮ LIỆU TỪ JSON
async function renderAboutTemplates() {
  const res = await fetch('assets/js/templates-manifest.json');
  const templates = await res.json();
  
  // ==== 1. TẠO FILTER TOPIC DYNAMIC 
  // Lấy danh sách topic duy nhất
  const uniqueTopicsSet = new Set();
  templates.forEach(item => {
    if(item.topic) uniqueTopicsSet.add(String(item.topic).trim());
  });
  const uniqueTopics = Array.from(uniqueTopicsSet); // Ví dụ ['Coder', 'Designer', ...]

  // Render NÚT filter topic
  const topicFilterMenu = document.querySelector('.filter-menu.topic');
  if (topicFilterMenu) {
    topicFilterMenu.innerHTML = '<button class="filter-btn active" data-filter="all">All Templates</button>' +
      uniqueTopics.map(tp => `<button class="filter-btn" data-filter="${tp}">${tp}</button>`).join('');
  }

  // ==== 2. Nhóm template theo topic
  const group = {};
  uniqueTopics.forEach(t => group[t] = []);
  templates.forEach(tpl => {
    const tp = tpl.topic ? String(tpl.topic).trim() : null;
    if(tp && group[tp]) group[tp].push(tpl);
  });

  // ==== 3. Render section mỗi topic
  const sectionsHTML = uniqueTopics.map(tp => {
    const arr = group[tp];
    if (!arr.length) return '';
    const cardsHTML = arr.map(
      tpl => createCard(tpl.name, tpl.tags?.join(', ')||'', tpl.preview, tpl.tags?.[0], tpl.id, tpl.type)
    ).join('');
    return `
      <section class="portfolio-section" data-category="${tp}">
        <h2>${tp}</h2>
        <div class="portfolio-grid">
          ${cardsHTML}
        </div>
      </section>
    `;
  }).join('');

  const totalTemplates = templates.length;
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
        <button class="slider-nav prev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="slider-nav next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
        <div class="slider-dots">
          <span class="dot active" data-slide="0"></span>
          <span class="dot" data-slide="1"></span>
          <span class="dot" data-slide="2"></span>
        </div>
      </section>

      <section class="portfolio-container">
        <aside class="portfolio-sidebar">
          <h3 class="sidebar-title">Topic</h3>
          <div class="filter-menu topic"></div>

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
// 4. HÀM SETUP (GẮN EVENT VÀ CHẠY SLIDER)
export function initPortfolioPage() {
  
  // Lấy tham chiếu đến nút Type (vì nó tĩnh, lấy ở đây OK)
  const typeButtons = document.querySelectorAll('.filter-btn[data-type]');

  /**
   * Hàm lọc TỔNG HỢP
   */
  function applyAllFilters() {
    // Luôn query bên trong hàm để lấy trạng thái .active mới nhất
    const activeTopic = document.querySelector('.filter-btn[data-filter].active')?.dataset.filter || 'all';
    const activeType = document.querySelector('.filter-btn[data-type].active')?.dataset.type || 'all';

    document.querySelectorAll('.portfolio-section').forEach(section => {
      const sectionCategory = section.dataset.category;
      const isTopicMatch = (activeTopic === 'all' || sectionCategory === activeTopic);
      section.classList.toggle('hidden', !isTopicMatch);

      section.querySelectorAll('.image-wrapper').forEach(card => {
        const cardType = card.dataset.type;
        const isTypeMatch = (activeType === 'all' || cardType === activeType);
        card.classList.toggle('hidden', !isTypeMatch);
      });
    });
  }

  // --- Gắn sự kiện click ---

  // 1. Gắn sự kiện cho các nút Type (tĩnh)
  typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      typeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      applyAllFilters();
    });
  });

  // --- Chạy lần đầu khi tải trang ---
  renderAboutTemplates().then(() => {
    
    // ⭐ SỬA LỖI Ở ĐÂY
    // Bây giờ các nút Topic MỚI TỒN TẠI
    // 2. Gắn sự kiện cho các nút Topic (động)
    const topicButtons = document.querySelectorAll('.filter-btn[data-filter]');
    topicButtons.forEach(button => {
      button.addEventListener('click', () => {
        topicButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyAllFilters();
      });
    });
    // ⭐ KẾT THÚC SỬA LỖI

    // Chạy bộ lọc lần đầu sau khi mọi thứ đã render
    applyAllFilters();

  }).catch(err => {
    console.error("Lỗi khi render template:", err);
    const contentEl = document.querySelector('.portfolio-content');
    if (contentEl) contentEl.innerHTML = "<h2>Không thể tải được template. Vui lòng thử lại sau.</h2>";
  });

  // --- Code Slider (Giữ nguyên) ---
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const numSlides = slides.length;

  if (numSlides > 0) { 
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