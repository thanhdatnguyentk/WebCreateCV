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
      if(['INPUT','TEXTAREA','SELECT','BUTTON','IMG','SVG','CANVAS'].includes(el.tagName)) return;
      el.setAttribute('contenteditable','true');
      el.classList.add('editable-in-iframe');
    });

    clickBlocker = ev => {
      const t = ev.target;
      if(t.closest && t.closest('a')) ev.preventDefault();
    };
    doc.addEventListener('click', clickBlocker, true);

    if(!doc.getElementById('editable-style-by-parent')){
      const s = doc.createElement('style');
      s.id = 'editable-style-by-parent';
      s.textContent = `
.editable-in-iframe{outline:2px dashed rgba(59,130,246,0.85);padding:2px;border-radius:4px;}
.editable-in-iframe:focus{outline:2px solid rgba(37,99,235,0.9);box-shadow:0 6px 18px rgba(37,99,235,0.12);}
`;
      (doc.head||doc.documentElement).appendChild(s);
    }

    // image upload wrappers (same as before)
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

    const imageStyles = `
        .img-upload-wrapper { position: relative; display: inline-block; }
        .img-upload-overlay { display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); color: white; justify-content: center; align-items: center; cursor: pointer; border-radius: 4px; }
        .img-upload-wrapper:hover .img-upload-overlay { display: flex; }
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

    const wrappers = doc.querySelectorAll('.img-upload-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) {
            wrapper.parentNode.insertBefore(img, wrapper);
        }
        wrapper.remove();
    });

    const imageStyles = doc.getElementById('image-upload-styles');
    if (imageStyles) imageStyles.remove();
  }

  btn.addEventListener('click', function(e){
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
      console.warn('Could not access iframe document (cross-origin?). Opening in new tab.', err);
      window.open(iframe.src, '_blank');
    }
  });
}

// --- Dynamic manifest loading and UI binding ---
async function loadTemplatesManifest() {
  try {
    const res = await fetch('/assets/js/templates-manifest.json', {cache: 'no-store'});
    if (!res.ok) throw new Error('manifest not found');
    return await res.json();
  } catch (e) {
    console.warn('Could not load templates manifest:', e);
    return [];
  }
}

function renderTemplateBlocks(manifest) {
  const wrapper = document.getElementById('swiperWrapper');
  if(!wrapper) return;
  wrapper.innerHTML = '';
  manifest.forEach(item => {
    const block = document.createElement('div');
    block.className = 'Template-block';
    block.innerHTML = `
      <div class="Template-Thumbnail">
        <img src="${item.preview}" alt="${item.name}">
      </div>
      <div class="Template-Info">
        <h3>${item.name}</h3>
      </div>
      <div class="Template-Tags">
        ${item.tags ? item.tags.map(tag => `<span class="Template-Tag">${tag}</span>`).join('') : ''}
      </div>
    `;
    block.addEventListener('click', () => {
      const iframe = document.querySelector('.Template-preview-iframe');
      if (iframe) iframe.src = item.path;
      // update "Use this template" button dataset for later actions
      const useBtn = document.querySelector('.Primary-Button');
      if (useBtn) useBtn.dataset.template = item.path;
    });
    wrapper.appendChild(block);
  });
}

export default function templatePage(selectedTemplate) {
    setTimeout(async () => {
      // ensure setup runs after DOM insertion
      setTimeout(setupTemplatePage, 0);
      const manifest = await loadTemplatesManifest();
      renderTemplateBlocks(manifest);
      // initial preview: prefer selectedTemplate (from router), otherwise manifest[0]
      const initial = selectedTemplate || manifest[0];
      if (initial) {
        const iframe = document.querySelector('.Template-preview-iframe');
        if (iframe) iframe.src = initial.path;
        const useBtn = document.querySelector('.Primary-Button');
        if (useBtn) useBtn.dataset.template = initial.path;
        // set download link on Download button if present
        const downloadBtn = document.querySelector('.Primary-Button.download-btn');
        if (downloadBtn) downloadBtn.dataset.template = initial.path;
      }
    }, 0);

  const titleText = (selectedTemplate && selectedTemplate.name) ? selectedTemplate.name : 'Templates';
  const iframeSrc = (selectedTemplate && selectedTemplate.path) ? selectedTemplate.path : '/assets/template/dat_portfolio/index.html';

  return `
<div class="container">
  <div class="Template-container">
    <div class="row Template-header">
      <div class="col-1"></div>
      <div class="Template-title col-4">${titleText}</div>
      <div class="col-6"></div>
      <button class="Primary-Button col-3" data-template="${selectedTemplate && selectedTemplate.path ? selectedTemplate.path : ''}">Use this template</button>
      <button class="Primary-Button col-1 download-btn" data-template="${selectedTemplate && selectedTemplate.path ? selectedTemplate.path : ''}">Download</button>
    </div>

    <div class="row">
      <div class="Template-preview-container col-16" aria-label="Template preview">
        <iframe src="${iframeSrc}" title="${titleText} Template"
          class="Template-preview-iframe" loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          style="width:100%;height:720px;border:0;min-height:480px;"></iframe>
        <div class="Template-preview-fallback">
          <p>Unable to display preview. 
            <button class="Primary-Button">
              <a href="${iframeSrc}" target="_blank" rel="noopener noreferrer">Open template in new tab</a>
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="Referrence-container">
    <h2>Learn how to create a stand out portfolio</h2>
    <h3>from over 50 newest portfolio samples</h3>

    <div class="swiper-nav prev" onclick="window.scrollSwiper && window.scrollSwiper(-1)">
      <svg viewBox="0 0 24 24 " fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </div>

    <div class="swiper-wrapper" id="swiperWrapper"></div>

    <div class="swiper-nav next" onclick="window.scrollSwiper && window.scrollSwiper(1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </div>

    <div class="Referrence-button container">
      <div class="row">
        <div class="col-12"></div>
        <button class="Primary-Button col-4">
          <a href="#/homePage">See All Templates</a>
        </button>
      </div>
    </div>
  </div>
</div>
`;
}