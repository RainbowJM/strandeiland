import { theNav, theMenuButton, theImage } from "./variables.js";
function toggleMenu() {
    theNav.classList.toggle("open");
    theMenuButton.classList.toggle("menuOpen");
    console.log("open");
    theImage.classList.toggle("menuOpen");
}

export { toggleMenu }