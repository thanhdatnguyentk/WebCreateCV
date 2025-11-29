import { Api } from "../api.js";

export default function CVForm() {
  return `
    <form id="cv-form" class="cv-form">
      <input type="text" name="name" placeholder="Full Name" required>
      <input type="text" name="title" placeholder="Job Position" required>
      <input type="email" name="email" placeholder="Email" required>
      <button class="btn" type="submit">Save CV</button>
    </form>
  `;
}

// Register events after render
export function setupCVForm() {
  const form = document.getElementById("cv-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const res = await Api.saveCV(data);
      alert("CV saved! ID: " + res.id);
    });
  }
}
