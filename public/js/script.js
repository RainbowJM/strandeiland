document.addEventListener("DOMContentLoaded", function() {
  const selectedOption = document.querySelector(".selected-option");
  const dropdownMenu = document.getElementById("themeDropdownMenu");
  
  selectedOption.addEventListener("click", function() {
    dropdownMenu.classList.toggle("show");
  });
  
  function updateThemes() {
    const checkboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
    console.log('checkboxes',checkboxes);
    const selectedThemes = [];
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedThemes.push(checkbox.value);
        }
    });
    selectedOption.textContent = selectedThemes.length > 0 ? selectedThemes.join(", ") : "Selecteer de passende thema's";
  }
  
  const themeCheckboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", updateThemes);
  });
});


