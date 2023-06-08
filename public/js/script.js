// ------------------ variables -------------------------------------------------------

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
console.log('themeSelect', themeSelect)

// ------------------ logic -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
  const selectedOption = document.querySelector(".selected-option");
  const dropdownMenu = document.getElementById("themeDropdownMenu");
  const localStorageKey = "formData";
  
  selectedOption.addEventListener("click", function() {
    dropdownMenu.classList.toggle("show");
  });
  
  function updateFormData() {
    const checkboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
    const selectedThemes = [];
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        selectedThemes.push(checkbox.value);
      }
    });
    selectedOption.textContent = selectedThemes.length > 0 ? selectedThemes.join(", ") : "Selecteer de passende thema's";
    
    const formData = {
      titel: document.getElementById("titel").value,
      beschrijving: document.getElementById("beschrijving").value,
      themas: selectedThemes
    };
    
    // Save form data to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(formData));
  }
  
  const themeCheckboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateFormData);
  });
  
  // Retrieve form data from localStorage
  const savedFormData = localStorage.getItem(localStorageKey);
  if (savedFormData) {
    const parsedFormData = JSON.parse(savedFormData);
    
    // Set the saved values in the corresponding form fields
    document.getElementById("titel").value = parsedFormData.titel;
    document.getElementById("beschrijving").value = parsedFormData.beschrijving;
    
    parsedFormData.themas.forEach(function(theme) {
      const checkbox = document.querySelector(`#themeDropdownMenu input[type='checkbox'][value='${theme}']`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
    updateFormData();
  }
});
if (asideItems.length > 0) {
  asideItems.forEach((asideItem) => {
    asideItem.addEventListener('click', () => {
      console.log('click')
      asideItem.classList.toggle('active');
    });
  });
}

if (theMenuButton) {
  theMenuButton.addEventListener("click", toggleMenu);
}

if (themaFilterBtn) {
  themaFilterBtn.addEventListener("click", () => {
    filterMenu.classList.toggle("show-filter");
  });
}

if (themeSelect) {
  themeSelect.addEventListener("change", function () {
    displaySelectedOption(themeSelect);
  });
}

// filter menu
toggleFilterMenu();
// previewFilterItems();


// ------------------ functions -------------------------------------------------------
function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}
// hamburger
function toggleMenu() {
    theNav.classList.toggle("open");
    theMenuButton.classList.toggle("menuOpen");
    console.log("open")
    theImage.classList.toggle("menuOpen");
}

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


// function previewFilterItems(){  
//   console.log('filter items');
//   const filterItems = document.querySelectorAll('.theme-filter-items li, .sorting-filter-items li');
//   let selectedFilterItems = [];
//   console.log('filter items', filterItems);
//   filterItems.forEach(filterItem => { 
//     filterItem.addEventListener('click', (e) => {

//       e.preventDefault();
//     })
//   })
// }