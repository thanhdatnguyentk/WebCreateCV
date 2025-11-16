import { showAlert } from "../assets/js/components/alert.js";

let flagListeners = [];

// Selectors for contenteditable elements
const EDITABLE_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,span,li,td,th,figcaption,blockquote,div';
const NON_EDITABLE_TAGS = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'IMG', 'SVG', 'CANVAS'];
const IFRAME_SELECTOR = '.Template-preview-iframe';

export function setupTemplatePage() {
  const btn = document.querySelector('.Primary-Button');
  if (!btn) return;

  let editOn = false;
  let clickBlocker = null;

  function enableEditable(doc) {
    // Enable content editing on selected elements
    const nodes = doc.querySelectorAll(EDITABLE_SELECTOR);
    nodes.forEach(el => {
      if (NON_EDITABLE_TAGS.includes(el.tagName) || el.classList.contains('no-edit')) return;
      el.setAttribute('contenteditable', 'true');
      el.classList.add('editable-in-iframe');
    });

    // Block link navigation and special UI clicks while editing
    clickBlocker = ev => {
      const target = ev.target;
      if (target.closest('.img-upload-wrapper') ||
          target.classList.contains('editable-link-icon') ||
          target.classList.contains('editable-flag-in-iframe')) {
        return;
      }
      if (target.closest && target.closest('a')) {
        ev.preventDefault();
      }
    };
    doc.addEventListener('click', clickBlocker, true);

    // Inject editable styles for visual feedback
    if (!doc.getElementById('editable-style-by-parent')) {
      const style = doc.createElement('style');
      style.id = 'editable-style-by-parent';
      style.textContent = `
        .editable-in-iframe {
          outline: 2px dashed rgba(59,130,246,0.85);
          padding: 2px;
          border-radius: 4px;
        }
        .editable-in-iframe:focus {
          outline: 2px solid rgba(37,99,235,0.9);
          box-shadow: 0 6px 18px rgba(37,99,235,0.12);
        }
        /* Styles for editable flag elements */
        .editable-flag-in-iframe {
          outline: 2px dashed rgba(16,185,129,0.85);
          padding: 2px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .editable-flag-in-iframe:hover {
          outline: 2px solid rgba(5,150,105,0.9);
          box-shadow: 0 6px 18px rgba(5,150,105,0.12);
        }
        /* Styles for link edit icons */
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
      `;
      (doc.head || doc.documentElement).appendChild(style);
    }

    // Enable editing for flag images
    const flagImages = doc.querySelectorAll('img[src*="flagcdn.com"]');
    flagImages.forEach(img => {
      img.classList.add('editable-flag-in-iframe');
      img.style.position = 'relative';
      img.addEventListener('click', () => {
        const countryCode = prompt('Enter country code (e.g., us, fr, vn):');
        if (countryCode) {
          const newUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
          img.src = newUrl;
        }
      });
    });

    // Setup image upload functionality (except flags)
    const imageUploadWrappers = doc.querySelectorAll('img:not([src*="flagcdn.com"])');
    const imageUploadStyles = doc.getElementById('image-upload-styles');
    if (!imageUploadStyles) {
      const styles = doc.createElement('style');
      styles.id = 'image-upload-styles';
      styles.textContent = `
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
      doc.head.appendChild(styles);
    }

    // Attach upload handlers to images
    imageUploadWrappers.forEach(img => {
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
          reader.onload = (ev) => {
            img.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Enable link URL editing
    doc.querySelectorAll('a[target="_blank"]').forEach(linkEl => {
      linkEl.style.position = 'relative';
      const editIcon = doc.createElement('span');
      editIcon.className = 'editable-link-icon';
      editIcon.textContent = '✏️';
      editIcon.addEventListener('click', () => {
        const currentUrl = linkEl.getAttribute('href') || '';
        const newUrl = prompt('Enter new URL:', currentUrl);

        if (newUrl && newUrl.trim() !== '') {
          linkEl.setAttribute('href', newUrl);
        }
      });

      linkEl.appendChild(editIcon);
    });
  }

  function disableEditable(doc) {
    // Disable content editing
    const nodes = doc.querySelectorAll('[contenteditable="true"]');
    nodes.forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('editable-in-iframe');
    });
    
    // Remove injected styles and event listeners
    const style = doc.getElementById('editable-style-by-parent');
    if (style) style.remove();
    if (clickBlocker) {
      doc.removeEventListener('click', clickBlocker, true);
      clickBlocker = null;
    }

    // Restore original image elements
    const wrappers = doc.querySelectorAll('.img-upload-wrapper');
    wrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (img) wrapper.parentNode.insertBefore(img, wrapper);
      wrapper.remove();
    });

    const imageStyles = doc.getElementById('image-upload-styles');
    if (imageStyles) imageStyles.remove();

    // Clean up flag listeners and styles
    flagListeners.forEach(pair => {
      pair.el.removeEventListener('click', pair.listener);
      pair.el.classList.remove('editable-flag-in-iframe');
    });
    flagListeners = [];

    // Remove link edit icons and reset styling
    doc.querySelectorAll('.editable-link-icon').forEach(icon => icon.remove());
    doc.querySelectorAll(
      '.project a[target="_blank"], #contact a[target="_blank"]'
    ).forEach(link => {
      link.style.position = '';
    });
  }

  // Toggle edit mode on button click
  btn.addEventListener('click', function(e) {
    const isLoggedIn = !!sessionStorage.getItem('authToken');
    if (!isLoggedIn) {
      showAlert('Hãy đăng nhập để sử dụng tính năng này.', 'warning');
      window.location.hash = '/login';
      return;
    }
    e.preventDefault();
    const iframe = document.querySelector(IFRAME_SELECTOR);
    if (!iframe) {
      showAlert('Preview iframe not found.', 'error');
      return;
    }

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) throw new Error('no doc');

      editOn = !editOn;
      if (editOn) {
        enableEditable(doc);
        btn.textContent = 'Exit edit mode';
      } else {
        disableEditable(doc);
        btn.textContent = 'Use this template';
      }
    } catch (err) {
      console.warn(
        'Could not access iframe document (cross-origin?). Opening in new tab.',
        err
      );
      window.open(iframe.src, '_blank');
    }
  });
}

// Load templates manifest from JSON file
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

// Render template blocks in swiper carousel
export async function renderTemplateBlocks(manifest) {
  try {
    // Populate swiper with template blocks
    const wrapper = document.getElementById('swiperWrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    manifest.forEach(item => {
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
        const iframe = document.querySelector(IFRAME_SELECTOR);
        if (iframe) iframe.src = item.path;
        const useBtn = document.querySelector('.Primary-Button');
        if (useBtn) useBtn.dataset.template = item.path;
      });
      wrapper.appendChild(a);
    });
  } catch (err) {
    console.warn('renderTemplateBlocks error:', err);
  }
}

// Helper to check if user is logged in
const ensureLoggedIn = () => {
  const isLoggedIn = !!sessionStorage.getItem('authToken');
  if (!isLoggedIn) {
    showAlert('Hãy đăng nhập để sử dụng tính năng này.', 'warning');
    window.location.hash = '/login';
  }
  return isLoggedIn;
};

// Main template page component
export default function templatePage(selectedTemplate) {
  setTimeout(async () => {
    // Initialize template page after DOM insertion
    setTimeout(setupTemplatePage, 0);
    const manifest = await loadTemplatesManifest();
    renderTemplateBlocks(manifest);

    // Set initial template preview
    const initial = selectedTemplate || manifest[0];
    if (initial) {
      const iframe = document.querySelector(IFRAME_SELECTOR);
      if (iframe) iframe.src = initial.path;
      const useBtn = document.querySelector('.Primary-Button');
      if (useBtn) useBtn.dataset.template = initial.path;
      const downloadBtn = document.querySelector('.Primary-Button.download-btn');
      if (downloadBtn) downloadBtn.dataset.template = initial.path;
    }

    // Setup ZIP download handler
    const downloadBtn = document.querySelector('.Primary-Button.download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async (e) => {
        if (!ensureLoggedIn()) return;
        e.preventDefault();
        const templatePath = downloadBtn.dataset.template;
        if (!templatePath) {
          showAlert('No template selected.', 'warning');
          return;
        }
        try {
          const { downloadTemplate } = await import(
            '/assets/js/download-template.js'
          );
          const folderUrl = templatePath.replace(/index\.html$/i, '');
          await downloadTemplate(folderUrl);
          showAlert('Template downloaded successfully.', 'success');
        } catch (err) {
          console.error('Download failed:', err);
          showAlert('Template download failed.', 'error');
        }
      });
    }

    // Setup PDF download handler
    const pdfDownloadBtn = document.querySelector('.Primary-Button.pdf-download-btn');
    if (pdfDownloadBtn) {
      pdfDownloadBtn.addEventListener('click', async (e) => {
        if (!ensureLoggedIn()) return;
        e.preventDefault();
        try {
          // Dynamically load html2pdf library
          const script = document.createElement('script');
          script.src =
            'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = async () => {
            const iframe = document.querySelector(IFRAME_SELECTOR);
            if (!iframe) {
              showAlert('Preview not found.', 'error');
              return;
            }
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
              if (!iframeDoc) {
                showAlert('Cannot access iframe content.', 'error');
                return;
              }
              const element = iframeDoc.documentElement;
              const fileName = selectedTemplate?.name?.replace(/\s+/g, '_') || 'template';
              const opt = {
                margin: 10,
                filename: fileName + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
              };
              window.html2pdf().set(opt).from(element).save();
              showAlert('PDF downloaded successfully.', 'success');
            } catch (err) {
              console.error('PDF generation failed:', err);
              showAlert('PDF download failed.', 'error');
            }
          };
          script.onerror = () => {
            showAlert('Could not load html2pdf library.', 'error');
          };
          document.head.appendChild(script);
        } catch (err) {
          console.error('PDF download error:', err);
          showAlert('PDF error.', 'error');
        }
      });
    }
  }, 0);

  const titleText = selectedTemplate?.name || 'Templates';
  const iframeSrc = selectedTemplate?.path || '/assets/template/dat_portfolio/index.html';
  const templatePath = selectedTemplate?.path || '';

  return `
<div class="container">
  <div class="Template-container">
    <div class="row Template-header">
      <div class="col-1"></div>
      <div class="Template-title col-4">${titleText}</div>
      <div class="col-2"></div>
      <button class="Primary-Button col-3" data-template="${templatePath}">
        Use this template
      </button>
      <button class="Primary-Button col-1 download-btn" data-template="${templatePath}">
        Download
      </button>
      <button class="Primary-Button col-4 pdf-download-btn" data-template="${templatePath}">
        Download PDF
      </button>
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
              <a href="${iframeSrc}" target="_blank" rel="noopener noreferrer">
                Open template in new tab
              </a>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        <div class="col-12"></div>
      </div>
    </div>
  </div>
</div>
`;
}
