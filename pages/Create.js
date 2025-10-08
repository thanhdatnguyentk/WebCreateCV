import CVForm, { setupCVForm } from "../assets/js/components/modal.js";

export default function CreatePage() {
  setTimeout(setupCVForm, 0); // chờ render xong DOM
  return `
    <main>
      <div class="container">
        <h2>Tạo CV của bạn</h2>
        ${CVForm()}
      </div>
    </main>
  `;
}
