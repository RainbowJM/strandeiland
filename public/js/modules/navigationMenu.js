import { theNav, theMenuButton, theImage } from "./variables.js";
function toggleMenu() {
  theNav.classList.toggle("open");
  theMenuButton.classList.toggle("menuOpen");
  theImage.classList.toggle("menuOpen");
}

export { toggleMenu };
