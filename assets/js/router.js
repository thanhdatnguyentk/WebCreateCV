import HomePage from "../../pages/Home.js"; 
import AboutPage from "../../pages/About.js";
import CreatePage from "../../pages/Create.js";

import ContactPage from "../../pages/Contact.js";
import LoginPage from "../../pages/LoginPage.js";
import SignupPage from "../../pages/SignupPage.js";
import { render, getHashPath } from "./utils.js";
import Header from "./components/header.js";  
import Footer from "./components/footer.js";


const routes = {
  "/homePage": HomePage,
  "/create": CreatePage,
  "/contact": ContactPage,
  "/login": LoginPage,
  "/signup": SignupPage,
  "/": AboutPage,
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
