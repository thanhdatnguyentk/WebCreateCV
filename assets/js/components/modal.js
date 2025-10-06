import { Api } from "../api.js";

export default function CVForm() {
  return `
    <form id="cv-form" class="cv-form">
      <input type="text" name="name" placeholder="Họ và tên" required>
      <input type="text" name="title" placeholder="Vị trí ứng tuyển" required>
      <input type="email" name="email" placeholder="Email" required>
      <button class="btn" type="submit">Lưu CV</button>
    </form>
  `;
}

// Đăng ký sự kiện sau khi render
export function setupCVForm() {
  const form = document.getElementById("cv-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const res = await Api.saveCV(data);
      alert("Đã lưu CV! Mã số: " + res.id);
    });
  }
}
