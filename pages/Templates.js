import { showAlert } from "../assets/js/components/alert.js";

// --- MỚI: Dùng để lưu các event listener của lá cờ ---
let flagListeners = [];
// ----------------------------------------------------

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
      
      // --- SỬA 1: Bỏ qua các <li> có class 'no-edit' (dùng cho lá cờ) ---
      if(el.classList.contains('no-edit')) return; 
      // --------------------------------------------------------------------

      el.setAttribute('contenteditable','true');
      el.classList.add('editable-in-iframe');
    });

    // --- SỬA 2: Cập nhật clickBlocker để bỏ qua overlay, cờ, và icon sửa link ---
    clickBlocker = ev => {
      const t = ev.target;

      // 1. Bỏ qua click vào overlay tải ảnh
      if (t.closest('.img-upload-wrapper')) {
        return; 
      }
      
      // 2. Bỏ qua click vào icon sửa link
      if (t.classList.contains('editable-link-icon')) {
        return;
      }
      
      // 3. Bỏ qua click vào icon sửa cờ
      if (t.classList.contains('editable-flag-in-iframe')) {
        return;
      }

      // Nếu không phải 3 trường hợp trên, thì mới chặn link
      if(t.closest && t.closest('a')) {
        ev.preventDefault();
      }
    };
    // -------------------------------------------------------------------------
    doc.addEventListener('click', clickBlocker, true);

    if(!doc.getElementById('editable-style-by-parent')){
      const s = doc.createElement('style');
      s.id = 'editable-style-by-parent';
      s.textContent = `
.editable-in-iframe{outline:2px dashed rgba(59,130,246,0.85);padding:2px;border-radius:4px;}
.editable-in-iframe:focus{outline:2px solid rgba(37,99,235,0.9);box-shadow:0 6px 18px rgba(37,99,235,0.12);}

/* --- MỚI: STYLE CHO LÁ CỜ --- */
.editable-flag-in-iframe{
  outline:2px dashed rgba(16,185,129,0.85); /* Viền xanh lá */
  padding:2px;
  border-radius:4px;
  cursor:pointer;
  transition:all 0.2s;
}
.editable-flag-in-iframe:hover{
  outline:2px solid rgba(5,150,105,0.9);
  box-shadow:0 6px 18px rgba(5,150,105,0.12);
}
/* -------------------------- */

/* --- MỚI: STYLE CHO EDIT LINK --- */
.editable-link-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 100;
  background: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
.editable-link-icon:hover {
  background: #0056b3;
}
/* ------------------------------ */
`;
      (doc.head||doc.documentElement).appendChild(s);
    }

    // image upload wrappers (SỬA 3: Bỏ qua .flag)
    const imgElements = doc.querySelectorAll('img:not(.flag)');
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

    // --- MỚI: LOGIC CHO LÁ CỜ ---
    flagListeners = []; // Xóa các listener cũ
    const flagElements = doc.querySelectorAll('img.flag');
    
    flagElements.forEach(flagImg => {
      flagImg.classList.add('editable-flag-in-iframe');

      const flagClickListener = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let currentCode = 'vn';
        try {
          const urlParts = flagImg.src.split('/');
          currentCode = urlParts[urlParts.length - 1].split('.')[0];
        } catch (err) { /* Bỏ qua lỗi */ }

        const newCode = prompt('Nhập mã quốc gia (vd: us, vn, jp, fr...):', currentCode);

        if (!newCode || newCode.trim() === '' || newCode.toLowerCase() === currentCode.toLowerCase()) {
          return;
        }

        const newSrc = `https://flagcdn.com/w40/${newCode.toLowerCase()}.png`;

        fetch(newSrc)
          .then(res => {
            if (res.ok) {
              flagImg.src = newSrc;
            } else {
              alert('Không tìm thấy cờ cho mã này!');
            }
          })
          .catch(() => alert('Lỗi khi tải ảnh cờ!'));
      };

      flagImg.addEventListener('click', flagClickListener);
      flagListeners.push({ el: flagImg, listener: flagClickListener });
    });
    // --- KẾT THÚC LOGIC CỜ ---

    // --- MỚI: LOGIC CHO EDITABLE LINKS ---
    // Chọn các link trong .project và #contact MÀ CÓ target="_blank"
    const editableLinks = doc.querySelectorAll('.project a[target="_blank"], #contact a[target="_blank"]');
    
    editableLinks.forEach(linkEl => {
      // Thẻ cha (<a>) cần có position relative để icon định vị
      linkEl.style.position = 'relative'; 

      const editIcon = doc.createElement('span');
      editIcon.className = 'editable-link-icon';
      editIcon.innerHTML = '✏️'; // Emoji bút chì
      editIcon.title = 'Edit link';

      editIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 

        const currentUrl = linkEl.getAttribute('href');
        const newUrl = prompt('Nhập đường dẫn (URL) mới:', currentUrl);

        if (newUrl && newUrl.trim() !== '') {
          linkEl.setAttribute('href', newUrl);
        }
      });

      linkEl.appendChild(editIcon);
    });
    // --- KẾT THÚC LOGIC EDITABLE LINKS ---
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

    // --- MỚI: GỠ BỎ LISTENER VÀ STYLE CỦA LÁ CỜ ---
    flagListeners.forEach(pair => {
      pair.el.removeEventListener('click', pair.listener);
      pair.el.classList.remove('editable-flag-in-iframe');
    });
    flagListeners = []; // Dọn dẹp mảng
    // ----------------------------------------

    // --- MỚI: GỠ BỎ EDIT LINK ICONS ---
    doc.querySelectorAll('.editable-link-icon').forEach(icon => {
      icon.remove();
    });
    
    // Reset style position của thẻ <a>
    doc.querySelectorAll('.project a[target="_blank"], #contact a[target="_blank"]').forEach(linkEl => {
      linkEl.style.position = '';
    });
    // --- KẾT THÚC DỌN DẸP ---
  }

  btn.addEventListener('click', function(e){
    const isLoggedIn = !!(
        sessionStorage.getItem('authToken')
    );
    if (!isLoggedIn) {
        showAlert('Vui lòng đăng nhập để sử dụng tính năng này.', 'warning');
        window.location.hash = '/login';
        return;
    }
    e.preventDefault();
    const iframe = document.querySelector(iframeSelector);
    if(!iframe){
      showAlert('Preview iframe not found.', 'error');
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
// (Phần này giữ nguyên, không thay đổi)
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

export async function renderTemplateBlocks(manifest) {
  try{
  const res = await fetch('/assets/js/templates-manifest.json', {cache: 'no-store'});
  if(!res.ok) throw new Error('manifest not found');
  const manifest = await res.json();
  const wrapper = document.getElementById('swiperWrapper');
  if(!wrapper) return;
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
    a.addEventListener('click', () => {
      const iframe = document.querySelector('.Template-preview-iframe');
      if (iframe) iframe.src = item.path;
      // update "Use this template" button dataset for later actions
      const useBtn = document.querySelector('.Primary-Button');
      if (useBtn) useBtn.dataset.template = item.path;
    });
    wrapper.appendChild(a);
  });
  }catch(err){
        console.warn('setup Templatepage   error', err);
    }
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
      const downloadBtn = document.querySelector('.Primary-Button.download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async (e) => {
      const isLoggedIn = !!sessionStorage.getItem("authToken");
      if (!isLoggedIn) {
        showAlert("Vui lòng đăng nhập để sử dụng tính năng này.", "warning");
        window.location.hash = "/login";
        return;
      }
      e.preventDefault();
      const templatePath = downloadBtn.dataset.template;
      if (!templatePath) {
        alert("No template selected.");
        return;
      }
      try {
        // nạp module download-template.js động
        const { downloadTemplate } = await import(
          "/assets/js/download-template.js"
        );
        // Lấy thư mục cha (bỏ "index.html" nếu có)
        const folderUrl = templatePath.replace(/index\.html$/i, "");
        await downloadTemplate(folderUrl);
        showAlert("Đã tải xuống mẫu thành công.", "success");
      } catch (err) {
        console.error("Download failed:", err);
        showAlert("Tải xuống mẫu không thành công.", "error");
      }
    });
  }
  
  // PDF Download button handler
  const pdfDownloadBtn = document.querySelector('.Primary-Button.pdf-download-btn');
  if (pdfDownloadBtn) {
    pdfDownloadBtn.addEventListener("click", async (e) => {
      const isLoggedIn = !!sessionStorage.getItem("authToken");
      if (!isLoggedIn) {
        showAlert("Vui lòng đăng nhập để sử dụng tính năng này.", "warning");
        window.location.hash = "/login";
        return;
      }
      e.preventDefault();
      try {
        // Load html2pdf library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = async () => {
          const iframe = document.querySelector('.Template-preview-iframe');
          if (!iframe) {
            showAlert("Preview not found.", "error");
            return;
          }
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) {
              showAlert("Cannot access iframe content.", "error");
              return;
            }
            const element = iframeDoc.documentElement;
            const fileName = (selectedTemplate && selectedTemplate.name) ? selectedTemplate.name.replace(/\s+/g, '_') : 'template';
            const opt = {
              margin: 10,
              filename: fileName + '.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
            };
            window.html2pdf().set(opt).from(element).save();
            showAlert("Đã tải xuống PDF thành công.", "success");
          } catch (err) {
            console.error("PDF generation failed:", err);
            showAlert("Tải xuống PDF không thành công.", "error");
          }
        };
        script.onerror = () => {
          showAlert("Không thể tải thư viện html2pdf.", "error");
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error("PDF download error:", err);
        showAlert("Lỗi khi tải PDF.", "error");
      }
    });
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
      <div class="col-2"></div>
      <button class="Primary-Button col-3" data-template="${selectedTemplate && selectedTemplate.path ? selectedTemplate.path : ''}">Use this template</button>
      <button class="Primary-Button col-1 download-btn" data-template="${selectedTemplate && selectedTemplate.path ? selectedTemplate.path : ''}">Download</button>
      <button class="Primary-Button col-4 pdf-download-btn" data-template="${selectedTemplate && selectedTemplate.path ? selectedTemplate.path : ''}">Download PDF</button>
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