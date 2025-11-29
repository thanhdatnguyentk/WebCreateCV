export async function initSwiper(wrapperId = 'swiperWrapper', manifestOrUrl = null) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return [];

  let manifest = null;
  if (Array.isArray(manifestOrUrl)) {
    manifest = manifestOrUrl;
  } else {
    const url = typeof manifestOrUrl === 'string' ? manifestOrUrl : '../js/templates-manifest.json';
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('manifest not found');
      manifest = await res.json();
    } catch (e) {
      console.warn('initSwiper: could not load manifest', e);
      manifest = [];
    }
  }

  wrapper.innerHTML = '';
  manifest.forEach(item => {
    const a = document.createElement('a');
    a.href = `#/template/${item.id}`;
    a.className = 'Template-block';
    a.dataset.templateId = item.id;
    a.innerHTML = `
      <div class="Template-Thumbnail"><img src="${item.preview}" alt="${item.name}"></div>
      <div class="Template-Info"><h3>${item.name}</h3></div>
    `;
    wrapper.appendChild(a);
  });

  // expose global helper for existing onclick attributes
  window.scrollSwiper = (dir) => scrollSwiper(dir, wrapperId);
  return manifest;
}

export function scrollSwiper(direction = 1, wrapperId = 'swiperWrapper') {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) {
    console.error('Swiper wrapper not found!');
    return;
  }
  const firstCard = wrapper.querySelector('.Template-block');
  if (!firstCard) return;
  const gap = parseInt(getComputedStyle(wrapper).gap) || 20;
  const cardWidth = firstCard.offsetWidth;
  wrapper.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
}
