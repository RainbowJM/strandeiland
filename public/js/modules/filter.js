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
            console.log('add active class');
            // tabContent.classList.add('active');

            closeFilterBtn.addEventListener("click", (e) => {
                e.preventDefault();
                filterThemeMenu.classList.remove('show-filter-menu');
                filterSortMenu.classList.remove('show-filter-menu');
                // tabContent.classList.remove("active");
                console.log("filter closed");
            });
    })
}
 
// function closeAll() {
//   tabContents.forEach(tabContent => {
//     console.log('add active class');
//     tabContent.classList.add('active');

//       closeFilterBtn.addEventListener("click", (e) => {
//             e.preventDefault();
//             tabContent.classList.remove("active");
//             console.log("filter closed");
//         });
//     });
    

 
// }

// function closeAll() {
//     tabs.forEach((tab) => {
//         const target = document.querySelector(tab.dataset.filterTarget);
//         tab.addEventListener("click", (e) => {
//             e.preventDefault();
//             tabContents.forEach((tabContent) =>
//                 tabContent.classList.remove("active")
//             );
//             target.classList.add("active");
//         });

//         filterThemeResultsBtn.addEventListener("click", (e) => {
//             e.preventDefault();
//             target.classList.remove("active");
//             console.log("form submitted");
//         });
//         filterSortBtn.addEventListener("click", (e) => {
//             e.preventDefault();
//             target.classList.remove("active");
//             console.log("form submitted");
//         });

//         closeFilterBtn.addEventListener("click", (e) => {
//             e.preventDefault();
//             target.classList.remove("active");
//             console.log("form submitted");
//         });
//     });
// }

export {toggleFilterMenu}