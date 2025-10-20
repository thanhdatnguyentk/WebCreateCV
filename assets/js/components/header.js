export default function Header() {
  return `
    <div class="navbar-container">
        <div class="navbar">
            <div class="navbar-logo">
                <a href="#/">
                    <img src="./assets/images/uit.png" alt="Logo" class="uit-logo">
                </a>
            </div>
            <div class="navbar-links">
                <a href="#/homePage">Library</a>
                <a href="#/contact">Contact</a>
            </div>
            <div class="navbar-actions">
                <a href="#/login" class="btn btn-login">Log in</a>
                <a href="#/signup" class="btn btn-signup">Sign up</a>
            </div>
        </div>
    </div>
  `;
}
