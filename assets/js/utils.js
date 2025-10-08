export function render(content) {
  document.getElementById("app").innerHTML = content;
}

export function getHashPath() {
  return location.hash.slice(1) || "/";
}
