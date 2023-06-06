const filterMenu = document.querySelector(".filter-theme-menu");
const filterBtns = document.querySelectorAll(".theme-btn, .sorting-btn");
const themeSelect = document.getElementById("thema");


filterBtns.forEach((button) =>{
  button.addEventListener('click', (e)=>{
    e.preventDefault()
    filterMenu.classList.toggle("show-filter");
  })
})


themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});


function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}
