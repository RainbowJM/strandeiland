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
