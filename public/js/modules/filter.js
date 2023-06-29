import { filterThemeResultsBtn, filterThemeBtn, filterSortBtn, filterSortResultsBtn } from "./variables.js";

function toggleFilterMenu(){
  const filterThemeMenu = document.querySelector('#theme');
  const  filterSortMenu = document.querySelector('#sorting');

  filterThemeBtn.addEventListener('click', () => {
    filterThemeMenu.classList.toggle('show-filter-menu');
  })  

  filterSortBtn.addEventListener('click', () => {
    filterSortMenu.classList.toggle('show-filter-menu');
  })

  filterSortResultsBtn.addEventListener('click', (e) => {
    e.preventDefault();
  })

  filterThemeResultsBtn.addEventListener('click', (e) => {
    e.preventDefault();
  })
}

export {toggleFilterMenu}