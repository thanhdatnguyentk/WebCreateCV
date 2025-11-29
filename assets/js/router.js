import HomePage, { setupHomePage } from "../../pages/Home.js"; 
import AboutPage, { initPortfolioPage } from "../../pages/About.js";
import CreatePage from "../../pages/Create.js";
import ContactPage from "../../pages/Contact.js";
import LoginPage from "../../pages/LoginPage.js";
import SignupPage from "../../pages/SignupPage.js";
import TemplatePage, { setupTemplatePage } from "../../pages/Templates.js";
import ProfilePage, { setupProfilePage } from "../../pages/ProfilePage.js";
import { render, getHashPath } from "./utils.js"; 
import Header, { setupHeader } from "./components/header.js";
import Footer from "./components/footer.js";

// Hàm để load template manifest
async function loadTemplatesManifest() {
  try {
    const res = await fetch('./assets/js/templates-manifest.json');
    return await res.json();
  } catch (e) {
    console.warn('Could not load templates manifest:', e);
    return [];
  }
}

// Cache cho manifest
let templatesManifest = null;

const routes = {
  "/homePage": HomePage,
  "/create": CreatePage,
  "/contact": ContactPage,
  "/login": LoginPage,
  "/signup": SignupPage,
  "/templatePage": TemplatePage,
  "/profile": ProfilePage,
  "/": AboutPage,
};

// Thêm hàm để render template cụ thể
function renderTemplate(templateId) {
  return async () => {
    // Load manifest nếu chưa có
    if (!templatesManifest) {
      templatesManifest = await loadTemplatesManifest();
    }
    
    // Tìm template trong manifest
    const template = templatesManifest.find(t => t.id === templateId);
    
    if (!template) {
      return `<main><h2>404 - Template không tồn tại</h2></main>`;
    }

    // Render template page với template được chọn
    const page = TemplatePage(template);
    return page;
  };
}

export async function router() {
  const path = getHashPath();
  
  // Kiểm tra nếu path là template path
  const templateMatch = path.match(/^\/template\/([^\/]+)/);
  
  let Page;
  if (templateMatch) {
    // Nếu là template path, render template cụ thể
    const templateId = templateMatch[1];
    Page = await renderTemplate(templateId)();
  } else {
    // Nếu không, sử dụng routes bình thường
    Page = routes[path] || (() => `<main><h2>404 - Không tìm thấy trang</h2></main>`);
    Page = Page();
  }

  const layout = `
    ${Header()}
    ${Page}
    ${Footer()}
  `;
  
  render(layout);

  // Luôn chạy setup cho header sau mỗi lần render
  setupHeader();

  // Init các functions sau khi render
  if (path === "/" || path === "/about") {
    initPortfolioPage();
  }
  if (path === "/homePage") {
    // render dynamic home blocks
    setTimeout(setupHomePage, 0);
  }
  if (path.startsWith("/template/") || path === "/templatePage") {
    setupTemplatePage();
  }
  if (path === "/profile") {
    setupProfilePage();
  }
}

// Cập nhật event listeners để xử lý async
window.addEventListener("hashchange", () => router());
window.addEventListener("load", () => router());
