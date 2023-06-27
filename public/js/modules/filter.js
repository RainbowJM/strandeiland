import { tabs, tabContents, filterThemeResultsBtn, filterThemeBtn,  filterSortBtn, filterSortResultsBtn, closeFilterBtn} from "./variables.js";


function toggleFilterMenu(){
    const filterThemeMenu = document.querySelector('#theme');
   const  filterSortMenu = document.querySelector('#sorting');

    filterThemeBtn.addEventListener('click', () => {
        filterThemeMenu.classList.toggle('show-filter-menu');
      console.log('clicked');
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