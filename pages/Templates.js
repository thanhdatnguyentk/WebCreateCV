export function setupTemplatePage() {
const btn = document.querySelector('.Primary-Button');
  const iframeSelector = '.Template-preview-iframe';
  if(!btn) return;

  let editOn = false;
  let clickBlocker = null;

  function enableEditable(doc){
    const selector = 'h1,h2,h3,h4,h5,h6,p,span,li,td,th,figcaption,blockquote,div';
    const nodes = doc.querySelectorAll(selector);
    nodes.forEach(el=>{
      // skip elements that are clearly interactive or structural
      if(['INPUT','TEXTAREA','SELECT','BUTTON','IMG','SVG','CANVAS'].includes(el.tagName)) return;
      el.setAttribute('contenteditable','true');
      el.classList.add('editable-in-iframe');
    });

    // prevent navigation while editing
    clickBlocker = ev => {
      const t = ev.target;
      if(t.closest && t.closest('a')) ev.preventDefault();
    };
    doc.addEventListener('click', clickBlocker, true);

    // inject visual styles
    if(!doc.getElementById('editable-style-by-parent')){
      const s = doc.createElement('style');
      s.id = 'editable-style-by-parent';
      s.textContent = `
.editable-in-iframe{outline:2px dashed rgba(59,130,246,0.85);padding:2px;border-radius:4px;}
.editable-in-iframe:focus{outline:2px solid rgba(37,99,235,0.9);box-shadow:0 6px 18px rgba(37,99,235,0.12);}
`;
      (doc.head||doc.documentElement).appendChild(s);
    }

    // Add image upload functionality
    const imgElements = doc.querySelectorAll('img');
    imgElements.forEach(img => {
        const wrapper = doc.createElement('div');
        wrapper.className = 'img-upload-wrapper';
        
        const uploadBtn = doc.createElement('input');
        uploadBtn.type = 'file';
        uploadBtn.accept = 'image/*';
        uploadBtn.className = 'img-upload-input';
        uploadBtn.style.display = 'none';

        const overlay = doc.createElement('div');
        overlay.className = 'img-upload-overlay';
        overlay.innerHTML = '<span>Click to change image</span>';
        
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(overlay);
        wrapper.appendChild(uploadBtn);

        overlay.addEventListener('click', () => uploadBtn.click());
        
        uploadBtn.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Add styles for image upload
    const imageStyles = `
        .img-upload-wrapper {
            position: relative;
            display: inline-block;
        }
        .img-upload-overlay {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            color: white;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 4px;
        }
        .img-upload-wrapper:hover .img-upload-overlay {
            display: flex;
        }
    `;

    const styleEl = doc.createElement('style');
    styleEl.id = 'image-upload-styles';
    styleEl.textContent = imageStyles;
    (doc.head || doc.documentElement).appendChild(styleEl);
  }

  function disableEditable(doc){
    const nodes = doc.querySelectorAll('[contenteditable="true"]');
    nodes.forEach(el=>{
      el.removeAttribute('contenteditable');
      el.classList.remove('editable-in-iframe');
    });
    const s = doc.getElementById('editable-style-by-parent');
    if(s) s.remove();
    if(clickBlocker) { doc.removeEventListener('click', clickBlocker, true); clickBlocker = null; }

    // Remove image upload functionality
    const wrappers = doc.querySelectorAll('.img-upload-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) {
            wrapper.parentNode.insertBefore(img, wrapper);
        }
        wrapper.remove();
    });

    // Remove image upload styles
    const imageStyles = doc.getElementById('image-upload-styles');
    if (imageStyles) imageStyles.remove();
  }

  btn.addEventListener('click', function(e){
    // kiểm tra đã đăng nhập (thử nhiều nơi phổ biến): localStorage/sessionStorage hoặc biến toàn cục
    const isLoggedIn = !!(
        localStorage.getItem('token') ||
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('token') ||
        window.__USER__
    );
    // if (!isLoggedIn) {
    //     alert('Vui lòng đăng nhập để sử dụng tính năng này.');
    //     window.location.href = 'index.html#/login';
    //     return;
    // }
    e.preventDefault();
    const iframe = document.querySelector(iframeSelector);
    if(!iframe){
      alert('Preview iframe not found.');
      return;
    }

    try{
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if(!doc) throw new Error('no doc');

      editOn = !editOn;
      if(editOn){
        enableEditable(doc);
        btn.textContent = 'Exit edit mode';
      } else {
        disableEditable(doc);
        btn.textContent = 'Use this template';
      }
    }catch(err){
      // cross-origin or other access issue -> open template in new tab as fallback
      console.warn('Could not access iframe document (cross-origin?). Opening in new tab.', err);
      window.open(iframe.src, '_blank');
    }
  });
}

export default function templatePage() {
    setTimeout(setupTemplatePage, 0);
  return `
<div class="container">
        <div class="Template-container">
            <div class="row Template-header">
                <div class="col-1"></div>
                <div class="Template-title col-4">Dat Portfolio</div>
                <div class="col-6"></div>
                <button class="Primary-Button col-3">Use this template</button>
                <button class="Primary-Button col-1">Download</button>
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

                            <a href="../assets/template/dat_portfolio/index.html" target="_blank"
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
                <div class="col-12"></div>
                <button class="Primary-Button col-4
                ">
                    <a href="/homePage">See All Templates</a>
                </button>
            </div>
        </div>
    </div>
</div>
`;
}