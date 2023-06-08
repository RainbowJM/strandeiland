const filterMenu = document.querySelector(".filter-menu");
const themaFilterBtn = document.querySelector(".thema-btn");
const themeSelect = document.getElementById("thema");
const theMenuButton = document.querySelector(".menuButton");
const theNav = document.querySelector(".navigation-links");
const theImage = document.querySelector(".menuContainer img");
const asideItems = document.querySelectorAll('.helping-item');
const tabs = document.querySelectorAll('[data-filter-target]');
const tabContents = document.querySelectorAll('[data-filter-content]');
const filterThemeBtn = document.querySelector('.filter-theme-btn');
const filterSortBtn = document.querySelector('.filter-sort-btn');
const closeFilterBtn = document.querySelector('.close-filter');

console.log('tabs', tabs)

asideItems.forEach((asideItem) => {
  asideItem.addEventListener('click', () => {
    console.log('click')
      asideItem.classList.toggle('active');
  });
});

theMenuButton.addEventListener("click", toggleMenu);

themaFilterBtn.addEventListener("click", () => {
  filterMenu.classList.toggle("show-filter");
});

themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});




function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}


// Toggle function
function toggleMenu() {
    theNav.classList.toggle("open");
    theMenuButton.classList.toggle("menuOpen");
    console.log("open")
    theImage.classList.toggle("menuOpen");
}


toggleFilterMenu();
// ------------------ filter menu ------------------
function toggleFilterMenu(){

  tabs.forEach(tab => {
    const target = document.querySelector(tab.dataset.filterTarget);
    tab.addEventListener('click', (e) => {
      e.preventDefault();
   tabContents.forEach(tabContent => tabContent.classList.remove('active'));
   target.classList.add('active');
    })
  
    filterThemeBtn.addEventListener('click', (e) => {
     e.preventDefault();
      target.classList.remove('active');
      console.log('form submitted')

    }
    )
    filterSortBtn.addEventListener('click', (e) => {
      e.preventDefault();
      target.classList.remove('active');
      console.log('form submitted')
    })

    
    closeFilterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      target.classList.remove('active');
      console.log('form submitted')
    })
  })


}
