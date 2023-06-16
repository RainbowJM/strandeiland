const messages = document.querySelector("#chat ul");
const submitMessage = document.querySelector("#message-button");
const input = document.querySelector("#message-input");
const themeFilterBtn = document.querySelector(".thema-btn");

// For the create wishes form component
const themeSelect = document.getElementById("thema");
const theMenuButton = document.querySelector(".menuButton");

// The navigation menu
const theNav = document.querySelector(".navigation-links");
const theImage = document.querySelector(".menuContainer img");
const asideItems = document.querySelectorAll(".helping-item");

// For the filter menu
const filterMenu = document.querySelector(".filter-menu");
const tabs = document.querySelectorAll("[data-filter-target]");
const tabContents = document.querySelectorAll("[data-filter-content]");
const filterThemeResultsBtn = document.querySelector(".filter-theme-results-btn");
const filterThemeBtn = document.querySelector(".theme-btn");
const filterSortBtn = document.querySelector(".sort-btn");
const filterSortResultsBtn = document.querySelector(".filter-sort-results-btn");
const closeFilterBtn = document.querySelector(".close-filter");
const typingElement = document.querySelector('#typing');


export { messages, submitMessage, input, filterMenu, themeFilterBtn, 
    themeSelect, theMenuButton, theNav, theImage, asideItems, tabs, 
    tabContents, filterThemeBtn, filterSortBtn, closeFilterBtn, typingElement, filterThemeResultsBtn, filterSortResultsBtn }
