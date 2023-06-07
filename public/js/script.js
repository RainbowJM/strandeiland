// const filterMenu = document.querySelector(".filter-menu");
// const themaFilterBtn = document.querySelector(".thema-btn");
// const themeSelect = document.getElementById("thema");


// themaFilterBtn.addEventListener("click", () => {
//   filterMenu.classList.toggle("show-filter");
// });

// themeSelect.addEventListener("change", function () {
//   displaySelectedOption(themeSelect);
// });


// function displaySelectedOption(selectElement) {
//   let selectedOption = selectElement.options[selectElement.selectedIndex].text;
//   selectElement.value = selectedOption;
// }

// Hamburger menu
const theMenuButton = document.querySelector(".menuButton");
const theNav = document.querySelector(".navigation-links");
const theImage = document.querySelector(".menuContainer img");


theMenuButton.addEventListener("click", toggleMenu);

// Toggle function
function toggleMenu() {
    theNav.classList.toggle("open");
    theMenuButton.classList.toggle("menuOpen");
    console.log("open")
    theImage.classList.toggle("menuOpen");

}


// Aside pop out
const asideItems = document.querySelectorAll('.helpende-item');

asideItems.forEach((asideItem) => {
    asideItem.addEventListener('click', () => {
      console.log('click')
        asideItem.classList.toggle('active');
    });
});

