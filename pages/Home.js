export function scrollSwiper(direction) {
    const wrapper = document.getElementById('swiperWrapper');
    
    if (!wrapper) {
        console.error('Swiper wrapper not found!');
        return;
    }
    
    // Get the first card's width + gap
    const firstCard = wrapper.querySelector('.Template-block');
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 20; // Your CSS gap
    const scrollAmount = cardWidth + gap;
    
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

window.scrollSwiper = scrollSwiper;

export default function HomePage() {
  return `
      <div class="container Homepage-Container">
        <h1>Explore over 100000 types of portfolio templates
            and edit as your own professional portfolio</h1>

        <div class="Category-Selector1" id="categorySelector1">
        </div>

        <div class="template-grid">
            <div class="row">
                <div class="col-1"></div>
                <!-- Dynamic template cards will be rendered here -->
                <div class="col-1"></div>
            </div>
        </div>

        <div class="Referrence-container">
            <h2>Learn how to create a stand out portfolio</h2>
            <h3>from over 50 newest portfolio samples</h3>
            
            <div class="swiper-nav prev" onclick="scrollSwiper(-1)">
                <svg viewBox="0 0 24 24 " fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </div>

            <div class="swiper-wrapper" id="swiperWrapper">
                    <!-- dynamic template blocks will be rendered here -->
                </div>
            
            <div class="swiper-nav next" onclick="scrollSwiper(1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </div>
        </div>
      </div>
  `;
}


// Initialization: load manifest and render dynamic blocks for Home page.
export async function setupHomePage(){
    try{
        const res = await fetch('/assets/js/templates-manifest.json', {cache: 'no-store'});
        if(!res.ok) throw new Error('manifest not found');
        const manifest = await res.json();

        // helper: render top template-grid: show first 3 templates (or provided list)
        function renderGrid(list){
            const grid = document.querySelector('.template-grid .row');
            if(!grid) return;
            const items = (list && list.length) ? list.slice(0,3) : [];
            let html = '<div class="col-1"></div>';
            items.forEach(item=>{
                html += `
                    <a href="#/template/${item.id}" class="Template-Card col-4">
                        <div class="Template-Thumbnail">
                            <img src="${item.preview}" alt="${item.name}">
                        </div>
                        <div class="Template-Name">${item.name}</div>
                        <div class="Category-Selector2">
                            ${item.tags ? item.tags.map(tag => `<span class="Template-Tag">${tag}</span>`).join('') : ''}
                        </div>
                    </a>
                    <div class="col-1"></div>`;
            });
            if(items.length === 0) html += '<div class="col-12">No templates found.</div>';
            grid.innerHTML = html;
        }

        // helper: render swiper blocks (uses existing DOM wrapper)
        function renderSwiper(list){
            const wrapper = document.getElementById('swiperWrapper');
            if(!wrapper) return;
            wrapper.innerHTML = '';
            (list && list.length ? list : manifest).forEach(item=>{
                const a = document.createElement('a');
                a.href = `#/template/${item.id}`;
                a.className = 'Template-block';
                a.innerHTML = `
                    <div class="Template-Thumbnail"><img src="${item.preview}" alt="${item.name}"></div>
                    <div class="Template-Name">${item.name}</div>
                    <div class="Template-Tags">
                        ${item.tags ? item.tags.map(tag => `<span class="Template-Tag">${tag}</span>`).join('') : ''}
                    </div>
                `;
                wrapper.appendChild(a);
            });
        }

        // build unique tag list from manifest
        const tagMap = new Map();
        manifest.forEach(item => {
            if (Array.isArray(item.tags)) {
                item.tags.forEach(t => {
                    const norm = String(t).trim().toLowerCase();
                    if (!tagMap.has(norm)) tagMap.set(norm, t);
                });
            }
        });
        const tags = Array.from(tagMap.entries()).map(([norm, display]) => ({ norm, display }));

        // render tag buttons into container
        const tagContainer = document.getElementById('categorySelector1');
        if(tagContainer){
            tagContainer.innerHTML = '';
            const allBtn = document.createElement('button');
            allBtn.type = 'button'; allBtn.className = 'Category-Card tag-button active';
            allBtn.dataset.tag = ''; allBtn.textContent = 'All';
            tagContainer.appendChild(allBtn);
            tags.forEach(t => {
                const btn = document.createElement('button');
                btn.type = 'button'; btn.className = 'Category-Card tag-button';
                btn.dataset.tag = t.norm; btn.textContent = t.display;
                tagContainer.appendChild(btn);
            });

            tagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.tag-button');
                if(!btn) return;
                const sel = btn.dataset.tag || '';
                tagContainer.querySelectorAll('.tag-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filtered = sel ? manifest.filter(it => Array.isArray(it.tags) && it.tags.some(tt => String(tt).trim().toLowerCase() === sel)) : manifest;
                renderGrid(filtered);
                renderSwiper(filtered);
            });
        }

        // initial render
        renderGrid(manifest);
        renderSwiper(manifest);

    }catch(err){
        console.warn('setupHomePage error', err);
    }
}

/* http://127.0.0.1:5500/index.html#/homePage */
