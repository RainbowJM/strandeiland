
const selectedOption = document.querySelector(".selected-option");
const dropdownMenu = document.getElementById("themeDropdownMenu");
const localStorageKey = "formData";
const themeCheckboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
const fileInput = document.getElementById("file");
const customImagePreview = document.getElementById("customImagePreview");
const selectedFileName = document.getElementById("selectedFileName");

// Function to handle selectedOption click
function handleSelectedOptionClick() {
  dropdownMenu.classList.toggle("show");
  selectedOption.classList.toggle('open');
}

// Function to handle themeCheckboxes change
function handleCheckboxChange() {
  updateFormData();
}

// Function to update form data
function updateFormData() {
  const checkboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
  const selectedThemes = [];

  checkboxes.forEach(function(checkbox) {
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

// Event listener for selectedOption click
selectedOption.addEventListener("click", handleSelectedOptionClick);

// Event listener for themeCheckboxes change
themeCheckboxes.forEach(function(checkbox) {
  checkbox.addEventListener("change", handleCheckboxChange);
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




document.addEventListener('DOMContentLoaded', () => {

  const imageLinkInput = document.getElementById('imageLink');

  const imagePreview = document.getElementById('imagePreview');
  imageLinkInput.addEventListener('input', () => {
      imagePreview.innerHTML = `<img src="${imageLinkInput.value}" alt="">`;

  });

});

fileInput.addEventListener("change", function() {
  const file = fileInput.files[0];

  if (file) {
    selectedFileName.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Selected Image";
      customImagePreview.innerHTML = "";
      customImagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else {
    selectedFileName.textContent = "Geen bestand geselecteerd";
    customImagePreview.innerHTML = "";
  }
});
