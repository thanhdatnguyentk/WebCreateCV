// ES module to download a template folder as a ZIP (including iframe-edited content)
// Usage: import('/assets/js/download-template.js').then(m => m.downloadTemplate('/assets/template/dat_portfolio/'))

export async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    s.onload = () => resolve(window.JSZip);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Parse URLs from HTML
function absoluteUrlsFromHtml(htmlText, baseUrl) {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  const urls = new Set();
  doc.querySelectorAll('link[href], script[src], img[src], source[src], video[src], audio[src], a[href]').forEach(el => {
    const attr = el.getAttribute('href') || el.getAttribute('src');
    if (attr && !attr.startsWith('#')) {
      try {
        urls.add(new URL(attr, baseUrl).href);
      } catch {}
    }
  });
  return Array.from(urls);
}

// Try listing all files if server allows directory listing
async function tryFetchDirectoryListing(folderUrl) {
  try {
    const res = await fetch(folderUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();

    // Basic check if it looks like an HTML directory index
    if (!/href=.*\/>/.test(text) && !/Parent Directory/.test(text)) return null;

    const doc = new DOMParser().parseFromString(text, 'text/html');
    const links = [];
    doc.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href === '../') return;
      try {
        const abs = new URL(href, folderUrl).href;
        links.push(abs);
      } catch {}
    });
    return links;
  } catch {
    return null;
  }
}

async function collectFiles(folderUrl) {
  if (!folderUrl.endsWith('/')) folderUrl += '/';

  // 1️⃣ Try to get directory listing (if allowed)
  const listing = await tryFetchDirectoryListing(folderUrl);
  if (Array.isArray(listing) && listing.length) {
    const allFiles = [];
    for (const link of listing) {
      if (link.endsWith('/')) {
        const sub = await collectFiles(link); // recursively include subfolders
        allFiles.push(...sub);
      } else {
        allFiles.push(link);
      }
    }
    return allFiles;
  }

  // 2️⃣ Fallback: fetch index.html and parse asset URLs
  let indexUrl;
  if (folderUrl.startsWith('http') || folderUrl.startsWith('/')) {
    indexUrl = folderUrl + 'index.html';
  } else {
    indexUrl = new URL(folderUrl + 'index.html', window.location.origin).href;
  }

  try {
    const res = await fetch(indexUrl, { cache: 'no-store' });
    if (!res.ok) return [indexUrl];
    const html = await res.text();
    const urls = absoluteUrlsFromHtml(html, indexUrl);
    urls.unshift(indexUrl);
    const candidates = [
      'thumbnail.png','thumbnail.jpg','thumb.png','thumb.jpg','logo.png','screenshot.png'
    ];
    candidates.forEach(name => {
      const u = new URL(name, folderUrl).href;
      if (!urls.includes(u)) urls.push(u);
    });
    return Array.from(new Set(urls));
  } catch {
    return [indexUrl];
  }
}

// Fetch file as ArrayBuffer
async function fetchAsArrayBuffer(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.arrayBuffer();
}

// Compute relative path inside ZIP
function makeEntryName(folderUrl, fileUrl) {
  try {
    const f = new URL(fileUrl);
    const base = new URL(folderUrl, window.location.origin);
    let rel = f.pathname.substring(base.pathname.length);
    if (rel.startsWith('/')) rel = rel.substring(1);
    if (!rel) rel = f.pathname.split('/').pop();
    return rel;
  } catch {
    return fileUrl.split('/').pop();
  }
}

export async function downloadTemplate(folderUrl, zipName = null) {
  if (!folderUrl) throw new Error('folderUrl required');
  if (!folderUrl.endsWith('/')) folderUrl += '/';

  await ensureJSZip();
  const JSZip = window.JSZip;

  console.log('📁 Collecting files from:', folderUrl);
  const files = await collectFiles(folderUrl);

  if (!files || !files.length) {
    alert('⚠️ No files found to download');
    return;
  }

  const zip = new JSZip();
  const folderName = zipName || folderUrl.replace(/\/$/, '').split('/').pop() || 'template';
  const zipFolder = zip.folder(folderName);

  for (const fileUrl of files) {
    try {
      const buffer = await fetchAsArrayBuffer(fileUrl);
      const entryName = makeEntryName(folderUrl, fileUrl);
      zipFolder.file(entryName, buffer);
    } catch (e) {
      console.warn('Skipping file (fetch failed):', fileUrl, e);
    }
  }

  // ✅ Override index.html if iframe exists
  const iframe = document.querySelector('#previewFrame');
  if (iframe?.contentDocument) {
    const editedHTML = iframe.contentDocument.documentElement.outerHTML;
    zipFolder.file('index.html', editedHTML);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = (zipName || folderName) + '.zip';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);

  console.log(`✅ Download complete: ${(zipName || folderName)}.zip`);
}
