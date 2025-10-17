import HomePage from "../../pages/Home.js"; 
import AboutPage from "../../pages/About.js";
import CreatePage from "../../pages/Create.js";
import GioiThieu from "../../pages/GioiThieu.js";
import ContactPage from "../../pages/Contact.js";
import { render, getHashPath } from "./utils.js";
import Header from "./components/header.js";  
import Footer from "./components/footer.js";


const routes = {
  "/homePage": HomePage,
  "/about": AboutPage,
  "/create": CreatePage,
  "/contact": ContactPage,
  "/": GioiThieu,
};

export function router() {
  const path = getHashPath();
  const Page = routes[path] || (() => `<main><h2>404 - Không tìm thấy trang</h2></main>`);
  const layout = `
    ${Header()}
    ${Page()}
    ${Footer()}
  `;
  render(layout);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
