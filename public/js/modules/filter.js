import { tabs, tabContents, filterThemeResultsBtn, filterThemeBtn,  filterSortBtn, filterSortResultsBtn, closeFilterBtn} from "./variables.js";


function toggleFilterMenu(){
    const filterThemeMenu = document.querySelector('#theme');
    const  filterSortMenu = document.querySelector('#sorting');

    filterThemeBtn.addEventListener('click', () => {
        filterThemeMenu.classList.toggle('show-filter-menu');

    })  

    filterSortBtn.addEventListener('click', () => {
        filterSortMenu.classList.toggle('show-filter-menu');

    })
        tabContents.forEach(tabContent => {

            closeFilterBtn.addEventListener("click", (e) => {
                e.preventDefault();
                filterThemeMenu.classList.remove('show-filter-menu');
                filterSortMenu.classList.remove('show-filter-menu');
            });
    })
}

export {toggleFilterMenu}