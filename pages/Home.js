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

        <h1>Standard CV templates in Vietnamese, English, Japanese, and Chinese (2025)</h1>

        <h3>Explore over 100000 types of portfolio templates
            and edit as your own professional portfolio</h3>

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
            <div class="row "></div>
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
                            
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                                <a href="#" class="Template-block">
                                    <div class="Template-Thumbnail">
                                        <img src="../assets/img/mau-cv-an-tuong-1.webp" alt="#1 unique portfolio sample">
                                    </div>
                                    <div class="Category-Button-Container">
                                        <div class="Category-Button">
                                            Programmer
                                        </div>
                                    </div>
                                </a>
                                
                            
                        </div>

            <div class="swiper-nav next" onclick="scrollSwiper(1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>
        </div>


    </div>
  `;


  /* http://127.0.0.1:5500/index.html#/homePage */
}

// Initialization: load manifest and render dynamic blocks for Home page.
export async function setupHomePage(){
    try{
        const res = await fetch('/assets/js/templates-manifest.json', {cache: 'no-store'});
        if(!res.ok) throw new Error('manifest not found');
        const manifest = await res.json();

        // Render template-grid: Show ALL templates
        const gridContainer = document.querySelector('.template-grid');
        if(gridContainer){
            gridContainer.innerHTML = ''; // Clear the container
            
            const cardsPerRow = 3;
            let html = '';
            
            manifest.forEach((item, index)=>{
                // Start a new row every 3 cards
                if (index % cardsPerRow === 0) {
                    // Close the previous row (if it exists) and open a new one
                    if (index > 0) {
                        html += '<div class="col-1"></div></div>'; // Close col-1 and row
                    }
                    html += '<div class="row ">'; // Open new row
                    html += '<div class="col-1"></div>'; // Add starting spacer
                }
                
                // Add the card
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
                    </a>`;
            });

            // Close the last row properly if templates exist
            if (manifest.length > 0) {
                 html += '<div class="col-1"></div></div>'; 
            }

            gridContainer.innerHTML = html;
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
