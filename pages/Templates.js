export default function templatePage() {

  return `
<div class="container">
        <div class="Template-container">
            <div class="row Template-header">
                <div class="col-1"></div>
                <div class="Template-title col-1">Dat Portfolio</div>
                <div class="col-12"></div>
                <button class="Primary-Button col-1">Use this template</button>
                <div class="col-1"></div>
            </div>
            <div class="row">

                <div class="Template-preview-container col-16" aria-label="Template preview">
                    <iframe src="../assets/template/dat_portfolio/index.html" title="Dat Portfolio Template"
                    class="Template-preview-iframe" loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    style="width:100%;height:720px;border:0;min-height:480px;">
                </iframe>
                <div class="Template-preview-fallback">
                    <p>Unable to display preview. 
                        <button class="Primary-Button">

                            <a href="../template/dat_portfolio/index.html" target="_blank"
                            rel="noopener noreferrer">Open template in new tab</a>
                        </button>
                    </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="Referrence-container">
            <h2>Learn how to create a stand out portfolio</h2>
            <h3>from over 50 newest portfolio samples</h3>
            
            <div class="swiper-nav prev" onclick="scrollSwiper(-1)">
                <svg viewBox="0 0 24 24 " fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </div>
            
            <div class="swiper-wrapper" id="swiperWrapper">
                
                <div class="Template-block">
                    <div class="Template-Thumbnail"></div>
                    <div class="Category-Button">
                        <h3>Programmer</h3>
                    </div>
                </div>
                
                <div class="Template-block">
                    <div class="Template-Thumbnail"></div>
                    <div class="Category-Button">
                        <h3>Programmer</h3>
                    </div>
                </div>
                
                <div class="Template-block">
                    <div class="Template-Thumbnail"></div>
                    <div class="Category-Button">
                        <h3>Programmer</h3>
                    </div>
                </div>
                
                <div class="Template-block">
                    <div class="Template-Thumbnail"></div>
                    <div class="Category-Button">
                        <h3>Programmer</h3>
                    </div>
                </div>
                
                <div class="Template-block">
                    <div class="Template-Thumbnail"></div>
                    <div class="Category-Button">
                        <h3>Programmer</h3>
                    </div>
                </div>
                
                
            </div>
            
            <div class="swiper-nav next" onclick="scrollSwiper(1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
        </div>
        <div class="Referrence-button container">
            <div class="row">
                <div class="col-14"></div>
                <button class="Primary-Button col-2">
                    <a href="/homePage">See All Templates</a>
                </button>
            </div>
        </div>
    </div>
</div>
`;
}