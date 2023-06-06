const filterMenu = document.querySelector(".filter-theme-menu");
const themeFilterBtns = document.querySelector(".theme-btn");
const sortingBtn = document.querySelector(".sorting-btn")
const themeSelect = document.getElementById("thema");

function filteringTab (evt, filterItem){
  let i, tabcontent, tablinks;
  tabcontent = document.querySelectorAll('.tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.add('hide')
    
  }
  tablinks = document.querySelectorAll('tablinks')
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace('active', '');
    
  }
}


themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});


function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}
