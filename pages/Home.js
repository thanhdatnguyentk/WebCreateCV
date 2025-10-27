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

        <div class="Category-Selector1">
            <div class="row">
                <div class="col-1"></div>
                <a href="#/category/featured" class="Category-Card">Featured</a>
                <a href="#/category/professional" class="Category-Card">Professional</a>
                <a href="#/category/minimal" class="Category-Card">Minimal</a>
                <a href="#/category/modern" class="Category-Card">Modern</a>
            </div>
        </div>

        <div class="template-grid">
            <div class="row ">
                <div class="col-1"></div>
                <a href="#/template/dat_portfolio" class="Template-Card col-4">
                    <div class="Template-Thumbnail">    
                        <img src="/assets/template/dat_portfolio/thumbnail.jpg" alt="Dat Portfolio Template">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </a>
                <div class="col-1"></div>
                <a href="#/template/rin_portfolio" class="Template-Card col-4">
                    <div class="Template-Thumbnail">
                        <img src="/assets/template/rin_portfolio/thumbnail.jpg" alt="Rin Portfolio Template">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </a>
                <div class="col-1"></div>
                <div class="Template-Card col-4">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
            </div>

            <div class="row ">
                <div class="col-1"></div>
                <div class="Template-Card col-4 ">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="Template-Card col-4 ">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="Template-Card col-4">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
            </div>

            <div class="row ">
                <div class="col-1"></div>
                <div class="Template-Card col-4 ">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="Template-Card col-4 ">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="Template-Card col-4">
                    <div class="Template-Thumbnail">
                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                    </div>
                    <div class="Template-Color-Selector">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="black" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#F75D77" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#27C840" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#00C8B3" />
                        </svg>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="white" />
                        </svg>
                    </div>

                    <div class="Template-Name"> PORTFOLIO #1</div>
                    <div class="Category-Selector2">
                        <div class="Category-Card">Featured</div>
                        <div class="Category-Card">Minimal</div>
                    </div>
                </div>
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

        // Render top template-grid: show first 3 templates (or fallbacks)
        const grid = document.querySelector('.template-grid .row');
        if(grid){
            // build three columns with templates
            const items = manifest.slice(0,3);
            let html = '<div class="col-1"></div>';
            items.forEach(item=>{
                html += `
                    <a href="#/template/${item.id}" class="Template-Card col-4">
                        <div class="Template-Thumbnail">
                            <img src="${item.preview}" alt="${item.name}">
                        </div>
                        <div class="Template-Color-Selector">
                            <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="black" /></svg>
                            <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#F75D77" /></svg>
                            <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#27C840" /></svg>
                            <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="#00C8B3" /></svg>
                            <svg width="24" height="24"><circle cx="12" cy="12" r="12" fill="white" /></svg>
                        </div>
                        <div class="Template-Name">${item.name}</div>
                        <div class="Category-Selector2">
                            <div class="Category-Card">${item.category || 'Featured'}</div>
                        </div>
                    </a>
                    <div class="col-1"></div>`;
            });
            grid.innerHTML = html;
        }

        // Render swiper blocks
        const wrapper = document.getElementById('swiperWrapper');
        if(wrapper){
            wrapper.innerHTML = '';
            manifest.forEach(item=>{
                const a = document.createElement('a');
                a.href = `#/template/${item.id}`;
                a.className = 'Template-block';
                a.innerHTML = `
                    <div class="Template-Thumbnail"><img src="${item.preview}" alt="${item.name}"></div>
                    <div class="Template-Info"><h3>${item.name}</h3></div>
                    <div class="Template-Tags">
                        ${item.tags ? item.tags.map(tag => `<span class="Template-Tag">${tag}</span>`).join('') : ''}
                    </div>
                `;
                wrapper.appendChild(a);
            });
        }

    }catch(err){
        console.warn('setupHomePage error', err);
    }
}

/* http://127.0.0.1:5500/index.html#/homePage */
