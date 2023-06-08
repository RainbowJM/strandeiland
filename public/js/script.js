const tabs = document.querySelectorAll('[data-filter-target]');
const tabContents = document.querySelectorAll('[data-filter-content]');
const filterThemeBtn = document.querySelector('.filter-theme-btn');
const filterSortBtn = document.querySelector('.filter-sort-btn');
const closeFilterBtn = document.querySelector('.close-filter');

console.log('tabs', tabs)
const themeSelect = document.getElementById("thema");
console.log('themeSelect', themeSelect)
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


themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});

