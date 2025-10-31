// download-template.js
// ES module to download a template folder as a ZIP (full folder + include iframe edits if available)
//
// Usage:
// import('/assets/js/download-template.js').then(m => m.downloadTemplate('/assets/template/dat_portfolio/'))

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

/* -----------------------
   Helper utilities
   ----------------------- */

// Normalize folderUrl to an absolute URL that ends with '/'
function normalizeFolderUrl(folderUrl) {
  if (!folderUrl) throw new Error('folderUrl required');
  // If folderUrl is an absolute URL already (starts with http/https), use it as base.
  // If it starts with '/', treat it as path relative to origin.
  // Otherwise, treat relative to current location.
  let abs;
  try {
    if (/^https?:\/\//i.test(folderUrl)) {
      abs = new URL(folderUrl, undefined).href;
    } else if (folderUrl.startsWith('/')) {
      abs = new URL(folderUrl, window.location.origin).href;
    } else {
      abs = new URL(folderUrl, window.location.href).href;
    }
  } catch {
    // fallback: prefix origin
    abs = new URL(folderUrl, window.location.origin).href;
  }
  if (!abs.endsWith('/')) abs += '/';
  return abs;
}

// Turn any URL/relative path in an HTML into absolute, using baseUrl
function absoluteUrlsFromHtml(htmlText, baseUrl) {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  const urls = new Set();
  // handle link[href], script[src], img[src], source[src], video[src], audio[src], a[href]
  doc.querySelectorAll('link[href]').forEach(l => {
    const href = l.getAttribute('href');
    if (href && !href.startsWith('#')) try { urls.add(new URL(href, baseUrl).href); } catch {}
  });
  doc.querySelectorAll('script[src]').forEach(s => {
    const src = s.getAttribute('src');
    if (src && !src.startsWith('#')) try { urls.add(new URL(src, baseUrl).href); } catch {}
  });
  doc.querySelectorAll('img[src], source[src], video[src], audio[src]').forEach(n => {
    const src = n.getAttribute('src');
    if (src && !src.startsWith('#')) try { urls.add(new URL(src, baseUrl).href); } catch {}
  });
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#')) try { urls.add(new URL(href, baseUrl).href); } catch {}
  });
  return Array.from(urls);
}

/* -----------------------
   Directory listing (server-side)
   ----------------------- */
// Try to fetch a directory listing from the server. Returns array of absolute URLs (files and subfolders)
async function tryFetchDirectoryListing(absFolderUrl) {
  try {
    const res = await fetch(absFolderUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    // heuristic: directory listing contains 'Parent Directory' or many <a href="...">
    if (!/href=.*\/>/.test(text) && !/Parent Directory/.test(text)) return null;
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const links = [];
    doc.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (href === '../') return;
      try {
        const abs = new URL(href, absFolderUrl).href;
        links.push(abs);
      } catch {}
    });
    return links;
  } catch (e) {
    return null;
  }
}

/* -----------------------
   Collect files logic
   - Attempts (in order):
     1) server directory listing (recursive)
     2) parse index.html and crawl declared assets (non-recursive)
   ----------------------- */

async function collectFilesRecursiveFromListing(absFolderUrl, seen = new Set()) {
  // absFolderUrl must end with '/'
  if (!absFolderUrl.endsWith('/')) absFolderUrl += '/';
  const entries = await tryFetchDirectoryListing(absFolderUrl);
  if (!entries || !entries.length) return [];
  const files = [];
  for (const ent of entries) {
    // avoid infinite loops
    if (seen.has(ent)) continue;
    seen.add(ent);
    if (ent.endsWith('/')) {
      // folder — recurse
      const sub = await collectFilesRecursiveFromListing(ent, seen);
      files.push(...sub);
    } else {
      files.push(ent);
    }
  }
  return files;
}

async function collectFilesByCrawlingIndex(absFolderUrl) {
  // absFolderUrl must end with '/'
  if (!absFolderUrl.endsWith('/')) absFolderUrl += '/';
  const indexUrl = absFolderUrl + 'index.html';
  try {
    const res = await fetch(indexUrl, { cache: 'no-store' });
    if (!res.ok) return [indexUrl];
    const html = await res.text();
    const urls = absoluteUrlsFromHtml(html, indexUrl);
    // ensure index at front
    urls.unshift(indexUrl);
    // add some common images
    const candidates = ['thumbnail.png','thumbnail.jpg','thumb.png','thumb.jpg','logo.png','screenshot.png'];
    for (const name of candidates) {
      try {
        const u = new URL(name, absFolderUrl).href;
        if (!urls.includes(u)) urls.push(u);
      } catch {}
    }
    // return unique
    return Array.from(new Set(urls));
  } catch (e) {
    return [indexUrl];
  }
}

async function collectFiles(folderUrl) {
  // normalize to absolute folder url
  const absFolderUrl = normalizeFolderUrl(folderUrl);

  // 1) try server directory listing (recursive)
  const listingFiles = await collectFilesRecursiveFromListing(absFolderUrl);
  if (Array.isArray(listingFiles) && listingFiles.length) {
    return listingFiles;
  }

  // 2) fallback: crawl index.html and collect assets inline (non-recursive)
  const crawled = await collectFilesByCrawlingIndex(absFolderUrl);
  return crawled;
}

/* -----------------------
   Fetch helpers
   ----------------------- */

async function fetchAsArrayBuffer(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.arrayBuffer();
}

// get a relative entry name inside the folder root for ZIP
function makeEntryName(folderUrl, fileUrl) {
  try {
    const absFolderUrl = normalizeFolderUrl(folderUrl); // absolute folder
    const f = new URL(fileUrl);
    const base = new URL(absFolderUrl);
    let rel = f.pathname.substring(base.pathname.length);
    if (rel.startsWith('/')) rel = rel.substring(1);
    // if query present, strip it for filename
    rel = rel.split('?')[0].split('#')[0];
    if (!rel) rel = f.pathname.split('/').pop();
    return rel;
  } catch {
    // fallback: last segment
    return fileUrl.split('/').pop();
  }
}

/* -----------------------
   Extract images from an HTMLDocument or string:
   - convert data:image/... imgs into separate files inside zipFolder
   - return modified HTML string (with updated srcs)
   ----------------------- */
function extractDataImagesAndRewriteHtml(docOrHtml, zipFolder, basePathForImages = 'assets/edited_images') {
  // docOrHtml may be Document or HTML string
  let doc;
  if (typeof docOrHtml === 'string') {
    doc = new DOMParser().parseFromString(docOrHtml, 'text/html');
  } else {
    doc = docOrHtml;
  }

  // create container path in zip
  const imageFiles = [];
  const imgs = doc.querySelectorAll('img[src]');
  let idx = 0;
  for (const img of imgs) {
    const src = img.getAttribute('src') || '';
    if (src.startsWith('data:')) {
      const m = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      if (!m) continue;
      const mime = m[1];
      const b64 = m[2];
      const ext = (mime.split('/')[1] || 'png').replace(/[^a-z0-9]+/ig,'');
      idx += 1;
      const filename = `${basePathForImages.replace(/\/$/,'')}/edited-img-${idx}.${ext}`;
      // store descriptor to be saved later (zipFolder available outside)
      imageFiles.push({ filename, base64: b64 });
      // update img src to relative path
      img.setAttribute('src', './' + filename);
    }
  }

  const outHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  return { html: outHtml, imageFiles };
}

/* -----------------------
   Main: downloadTemplate
   ----------------------- */

export async function downloadTemplate(folderUrl, zipName = null) {
  // validate and normalize
  if (!folderUrl) throw new Error('folderUrl required');
  if (!folderUrl.endsWith('/')) folderUrl += '/';

  await ensureJSZip();
  const JSZip = window.JSZip;

  const absFolderUrl = normalizeFolderUrl(folderUrl);
  console.log('downloadTemplate: normalized folder URL =', absFolderUrl);

  // 1) collect file list (server listing preferred)
  let files = [];
  try {
    files = await collectFiles(absFolderUrl);
  } catch (e) {
    console.warn('collectFiles failed, fallback to index.html only', e);
    files = [absFolderUrl + 'index.html'];
  }

  if (!files || !files.length) {
    alert('No files found to download');
    return;
  }

  // 2) prepare zip
  const zip = new JSZip();
  const folderName = zipName || (absFolderUrl.replace(/\/$/, '').split('/').pop()) || 'template';
  const zipFolder = zip.folder(folderName);

  // 3) fetch and add files sequentially
  for (const fileUrl of files) {
    try {
      // skip data URLs
      if (fileUrl.startsWith('data:')) continue;
      const buffer = await fetchAsArrayBuffer(fileUrl);
      const entryName = makeEntryName(absFolderUrl, fileUrl);
      zipFolder.file(entryName, buffer);
    } catch (e) {
      console.warn('Skipping file (fetch failed):', fileUrl, e);
    }
  }

  // 4) If iframe exists and is same-origin, override index.html with edited version
  const iframe = document.querySelector('.Template-preview-iframe') || document.querySelector('#previewFrame');
  if (iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Clone to avoid modifying live iframe
        const clone = iframeDoc.cloneNode(true);
        // Extract data images, rewrite HTML, and add images to zip
        const { html: rewrittenHtml, imageFiles } = extractDataImagesAndRewriteHtml(clone, zipFolder, 'assets/edited_images');

        // add extracted image files
        for (const img of imageFiles) {
          // img.base64 is base64 string
          zipFolder.file(img.filename, img.base64, { base64: true });
        }

        // Write rewritten index.html at root of zipFolder (overrides original)
        zipFolder.file('index.html', rewrittenHtml);
        console.log('downloadTemplate: added edited index.html and extracted images');
      } else {
        console.warn('downloadTemplate: iframe document not accessible (cross-origin?)');
      }
    } catch (err) {
      console.warn('downloadTemplate: failed to extract iframe edits (cross-origin or other):', err);
      // fallback: keep original index.html already added
    }
  }

  // 5) generate zip blob
  const blob = await zip.generateAsync({ type: 'blob' });

  // 6) trigger download
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (zipName || folderName) + '.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);

  console.log(`downloadTemplate: finished. (${(zipName || folderName)}.zip)`);
}
 