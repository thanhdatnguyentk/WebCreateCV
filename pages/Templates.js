import { showAlert } from "../assets/js/components/alert.js";

let flagListeners = [];

// Selectors for contenteditable elements
const EDITABLE_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,span,li,td,th,figcaption,blockquote,div';
const NON_EDITABLE_TAGS = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'IMG', 'SVG', 'CANVAS'];
const IFRAME_SELECTOR = '.Template-preview-iframe';

// Helper function to create link editing modal - synchronized with alert notification style
function createLinkEditModal(doc, linkEl, currentUrl) {
  // Create modal backdrop - matches alert component design
  const modal = doc.createElement('div');
  modal.className = 'link-edit-modal-backdrop';

  // Modal content dialog - matches alert notification styling
  const modalContent = doc.createElement('div');
  modalContent.className = 'link-edit-modal-content';

  // Title
  const title = doc.createElement('h3');
  title.textContent = 'Edit Link';

  // URL Label
  const inputLabel = doc.createElement('label');
  inputLabel.textContent = 'URL:';

  // URL Input
  const input = doc.createElement('input');
  input.type = 'text';
  input.value = currentUrl;
  input.placeholder = 'https://example.com';

  // Button container
  const buttonContainer = doc.createElement('div');
  buttonContainer.className = 'link-edit-modal-button-container';

  // Cancel button
  const cancelBtn = doc.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'link-edit-modal-cancel-btn';

  // Save button
  const saveBtn = doc.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'link-edit-modal-save-btn';

  // Close modal function
  const closeModal = () => {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s';
    setTimeout(() => modal.remove(), 200);
  };

  // Cancel button click
  cancelBtn.addEventListener('click', closeModal);

  // Save button click
  saveBtn.addEventListener('click', () => {
    const newUrl = input.value.trim();
    if (newUrl) {
      linkEl.setAttribute('href', newUrl);
      closeModal();
    } else {
      input.style.borderColor = '#dc3545';
      input.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 1500);
    }
  });

  // Keyboard shortcuts
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveBtn.click();
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Click outside modal to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Build DOM
  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(saveBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(inputLabel);
  modalContent.appendChild(input);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  doc.body.appendChild(modal);
  
  // Auto-focus and select text
  input.focus();
  input.select();
}


// Helper function to create flag country code editing modal
function createFlagEditModal(doc, flagImg, currentCountryCode) {
  // Create modal popup for flag country code editing
  const modal = doc.createElement('div');
  modal.className = 'flag-edit-modal';

  const modalContent = doc.createElement('div');

  const title = doc.createElement('h3');
  title.textContent = 'Change Flag';

  const inputLabel = doc.createElement('label');
  inputLabel.textContent = 'Country Code (e.g., us, fr, vn):';

  const input = doc.createElement('input');
  input.type = 'text';
  input.value = currentCountryCode;
  input.placeholder = 'us';

  const info = doc.createElement('p');
  info.textContent = 'Examples: us, gb, fr, de, jp, vn, kr, etc.';

  const buttonContainer = doc.createElement('div');
  buttonContainer.className = 'flag-edit-modal-button-container';

  const cancelBtn = doc.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'cancel-btn';

  const saveBtn = doc.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'save-btn';

  const closeModal = () => { modal.remove(); };

  cancelBtn.addEventListener('click', closeModal);

  saveBtn.addEventListener('click', () => {
    const countryCode = input.value.trim().toLowerCase();
    if (countryCode) {
      const newUrl = `https://flagcdn.com/w40/${countryCode}.png`;
      flagImg.src = newUrl;
      closeModal();
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  buttonContainer.appendChild(cancelBtn);
  buttonContainer.appendChild(saveBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(inputLabel);
  modalContent.appendChild(input);
  modalContent.appendChild(info);
  modalContent.appendChild(buttonContainer);
  modal.appendChild(modalContent);
  doc.body.appendChild(modal);
  input.focus();
  input.select();
}

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

    // Inject editable styles for visual feedback - now using external CSS
    if (!doc.getElementById('editable-style-by-parent')) {
      const link = doc.createElement('link');
      link.id = 'editable-style-by-parent';
      link.rel = 'stylesheet';
      link.href = '/assets/css/style.css';
      (doc.head || doc.documentElement).appendChild(link);
    }

    // Enable editing for flag images
    const flagImages = doc.querySelectorAll('img[src*="flagcdn.com"]');
    flagImages.forEach(img => {
      img.classList.add('editable-flag-in-iframe');
      img.style.position = 'relative';
      img.addEventListener('click', () => {
        const currentCode = img.src.match(/\/([a-z]{2,})\.png/)?.[1] || '';
        createFlagEditModal(doc, img, currentCode);
      });
    });

    // Setup image upload functionality (except flags)
    // Styles are now in external CSS file
    const imageUploadWrappers = doc.querySelectorAll('img:not([src*="flagcdn.com"])');

    // Attach upload handlers to images
    imageUploadWrappers.forEach(img => {
      const wrapper = doc.createElement('div');
      wrapper.className = 'img-upload-wrapper';
      const uploadBtn = doc.createElement('input');
      uploadBtn.type = 'file';
      uploadBtn.accept = 'image/*';
      uploadBtn.className = 'img-upload-input';
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

    // Enable link URL editing with modal popup
    doc.querySelectorAll('a[target="_blank"]').forEach(linkEl => {
      linkEl.style.position = 'relative';
      // SVG edit icon - modern and professional
      const editIcon = doc.createElement('span');
      editIcon.className = 'editable-link-icon';
      editIcon.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      `;
      editIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentUrl = linkEl.getAttribute('href') || '';
        createLinkEditModal(doc, linkEl, currentUrl);
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
      showAlert('Please log in to use this feature.', 'warning');
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
    const res = await fetch('./assets/js/templates-manifest.json', {cache: 'no-store'});
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
    showAlert('Please log in to use this feature.', 'warning');
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
          const generatePDF = () => {
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

          if (window.html2pdf) {
            generatePDF();
          } else {
            // Dynamically load html2pdf library
            const script = document.createElement('script');
            script.src =
              'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = generatePDF;
            script.onerror = () => {
              showAlert('Failed to load html2pdf library.', 'error');
            };
            document.head.appendChild(script);
          }
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

