const messages = document.querySelector("#chat ul");
const submitMessage = document.querySelector("#message-button");
const input = document.querySelector("#message-input");
const filterMenu = document.querySelector(".filter-menu");
const themeFilterBtn = document.querySelector(".thema-btn");
const themeSelect = document.getElementById("thema");
const theMenuButton = document.querySelector(".menuButton");
const theNav = document.querySelector(".navigation-links");
const theImage = document.querySelector(".menuContainer img");
const asideItems = document.querySelectorAll(".helping-item");
const tabs = document.querySelectorAll("[data-filter-target]");
const tabContents = document.querySelectorAll("[data-filter-content]");
const filterThemeBtn = document.querySelector(".filter-theme-btn");
const filterSortBtn = document.querySelector(".filter-sort-btn");
const closeFilterBtn = document.querySelector(".close-filter");
const typingElement = document.querySelector('#typing');
const selectedOption = document.querySelector(".selected-option");
const dropdownMenu = document.getElementById("themeDropdownMenu");
const localStorageKey = "formData";
const themeCheckboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
const fileInput = document.getElementById("file");
const customImagePreview = document.getElementById("customImagePreview");
const selectedFileName = document.getElementById("selectedFileName");
const popupCloseButton = document.getElementById("popupCloseButton");
const popup = document.getElementById("popup");
const savedFormData = localStorage.getItem(localStorageKey);
const imageLinkInput = document.getElementById('imageLink');
const imagePreview = document.getElementById('imagePreview');
const uploadButton = document.getElementById("uploadButton");

export { messages, submitMessage, input, filterMenu, themeFilterBtn, 
    themeSelect, theMenuButton, theNav, theImage, asideItems, tabs, 
    tabContents, filterThemeBtn, filterSortBtn, closeFilterBtn, typingElement,
    selectedOption, dropdownMenu, localStorageKey, themeCheckboxes, fileInput,
    customImagePreview, selectedFileName, popupCloseButton, popup, savedFormData,
    imageLinkInput, imagePreview, uploadButton }