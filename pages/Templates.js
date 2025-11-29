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
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  // Modal content dialog - matches alert notification styling
  const modalContent = doc.createElement('div');
  modalContent.className = 'link-edit-modal-content';
  modalContent.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0,0,0,0.08);
    width: 90%;
    max-width: 480px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  // Title
  const title = doc.createElement('h3');
  title.textContent = 'Edit Link';
  title.style.cssText = `
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  `;

  // URL Label
  const inputLabel = doc.createElement('label');
  inputLabel.textContent = 'URL:';
  inputLabel.style.cssText = `
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #3b3b3b;
    font-size: 14px;
  `;

  // URL Input
  const input = doc.createElement('input');
  input.type = 'text';
  input.value = currentUrl;
  input.placeholder = 'https://example.com';
  input.style.cssText = `
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  `;

  // Add focus state styling
  input.addEventListener('focus', () => {
    input.style.borderColor = '#007bff';
    input.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = '#ddd';
    input.style.boxShadow = 'none';
  });

  // Button container
  const buttonContainer = doc.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  `;

  // Cancel button
  const cancelBtn = doc.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    color: #3b3b3b;
  `;
  cancelBtn.addEventListener('mouseover', () => {
    cancelBtn.style.background = '#e8e8e8';
    cancelBtn.style.borderColor = '#ccc';
  });
  cancelBtn.addEventListener('mouseout', () => {
    cancelBtn.style.background = '#f5f5f5';
    cancelBtn.style.borderColor = '#ddd';
  });

  // Save button
  const saveBtn = doc.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.cssText = `
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: 1px solid #0056b3;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  `;
  saveBtn.addEventListener('mouseover', () => {
    saveBtn.style.background = '#0056b3';
    saveBtn.style.borderColor = '#003d82';
    saveBtn.style.transform = 'translateY(-1px)';
    saveBtn.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
  });
  saveBtn.addEventListener('mouseout', () => {
    saveBtn.style.background = '#007bff';
    saveBtn.style.borderColor = '#0056b3';
    saveBtn.style.transform = 'translateY(0)';
    saveBtn.style.boxShadow = 'none';
  });

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
        input.style.borderColor = '#ddd';
        input.style.boxShadow = 'none';
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
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const modalContent = doc.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    width: 90%;
    max-width: 500px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const title = doc.createElement('h3');
  title.textContent = 'Change Flag';
  title.style.cssText = 'margin: 0 0 16px 0; font-size: 18px; color: #333;';

  const inputLabel = doc.createElement('label');
  inputLabel.textContent = 'Country Code (e.g., us, fr, vn):';
  inputLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: 500; color: #555;';

  const input = doc.createElement('input');
  input.type = 'text';
  input.value = currentCountryCode;
  input.placeholder = 'us';
  input.style.cssText = `
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    text-transform: lowercase;
  `;

  const info = doc.createElement('p');
  info.textContent = 'Examples: us, gb, fr, de, jp, vn, kr, etc.';
  info.style.cssText = 'margin: 0 0 16px 0; font-size: 12px; color: #999;';

  const buttonContainer = doc.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

  const cancelBtn = doc.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  `;
  cancelBtn.onmouseover = () => { cancelBtn.style.background = '#e8e8e8'; };
  cancelBtn.onmouseout = () => { cancelBtn.style.background = '#f5f5f5'; };

  const saveBtn = doc.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.cssText = `
    padding: 10px 20px; 
    background: rgb(0, 123, 255); 
    color: white; 
    border: 1px solid rgb(0, 86, 179); 
    border-radius: 6px; 
    cursor: pointer; 
    font-size: 14px; 
    font-weight: 500; 
    transition: 0.2s; 
    transform: translateY(0px); 
    box-shadow: none;
  `;
  saveBtn.onmouseover = () => { saveBtn.style.background = '#218838'; };
  saveBtn.onmouseout = () => { saveBtn.style.background = '#28a745'; };

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
          top: 50%;
          right: 4px;
          transform: translateY(-50%);
          z-index: 100;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          padding: 6px 8px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: all 0.2s;
          opacity: 0;
        }
        a:hover .editable-link-icon {
          opacity: 1;
          transform: translateY(-50%) scale(1.05);
        }
        .editable-link-icon:hover {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.35);
          transform: translateY(-50%) scale(1.1);
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
        const currentCode = img.src.match(/\/([a-z]{2,})\.png/)?.[1] || '';
        createFlagEditModal(doc, img, currentCode);
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
          showAlert('Mẫu đã được tải.', 'success');
        } catch (err) {
          console.error('Download failed:', err);
          showAlert('Tải mẫu thất bại.', 'error');
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
              showAlert('PDF đã được tải.', 'success');
            } catch (err) {
              console.error('PDF generation failed:', err);
              showAlert('Tải PDF thất bại.', 'error');
            }
          };
          script.onerror = () => {
            showAlert('Không thể tải thư viện html2pdf.', 'error');
          };
          document.head.appendChild(script);
        } catch (err) {
          console.error('PDF download error:', err);
          showAlert('Lỗi PDF.', 'error');
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

