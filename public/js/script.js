const socket = io();

function displaySelectedOption(selectElement) {
    var selectedOption = selectElement.options[selectElement.selectedIndex].text;
    selectElement.value = selectedOption;
  }
  
  var themeSelect = document.getElementById("thema");
  themeSelect.addEventListener("change", function() {
    displaySelectedOption(themeSelect);
  });
  