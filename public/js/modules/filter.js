import {tabs, tabContents, filterThemeBtn, filterSortBtn, closeFilterBtn} from "./variables.js";

function toggleFilterMenu() {
    tabs.forEach((tab) => {
        const target = document.querySelector(tab.dataset.filterTarget);
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            tabContents.forEach((tabContent) =>
                tabContent.classList.remove("active")
            );
            target.classList.add("active");
        });

        filterThemeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            target.classList.remove("active");
            console.log("form submitted");
        });
        filterSortBtn.addEventListener("click", (e) => {
            e.preventDefault();
            target.classList.remove("active");
            console.log("form submitted");
        });

        closeFilterBtn.addEventListener("click", (e) => {
            e.preventDefault();
            target.classList.remove("active");
            console.log("form submitted");
        });
    });
}

export {toggleFilterMenu}