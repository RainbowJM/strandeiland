const filterMenu = document.querySelector(".filter-menu");
const themaFilterBtn = document.querySelector(".thema-btn");

themaFilterBtn.addEventListener("click", () => {
  filterMenu.classList.toggle("show-filter");
});

function displaySelectedOption(selectElement) {
  var selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}

var themeSelect = document.getElementById("thema");
themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});
