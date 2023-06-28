import {themeSelect,selectedOption,dropdownMenu,localStorageKey,themeCheckboxes, fileInput,customImagePreview,selectedFileName,
  savedFormData,imageLinkInput,imagePreview,titleInput,descriptionTextarea,uploadDialog,closeDialogButton,imgCloseDialogButton,themes} from "./modules/variables.js";

function loadFormData() {
  if (savedFormData) {
    if (titleInput) {
      titleInput.value = savedFormData.title;
    }
    if (descriptionTextarea) {
      descriptionTextarea.value = savedFormData.description;
    }
    if (themeCheckboxes) {
      themeCheckboxes.forEach((checkbox) => {
        checkbox.checked = savedFormData.themes.includes(checkbox.value);
      });
    }
    if (imageLinkInput) {
      imageLinkInput.value = savedFormData.imageLink;
      imagePreview.innerHTML = `<img src="${savedFormData.imageLink}" alt="">`;
    }
    if (fileInput) {
      selectedFileName.textContent = savedFormData.file ? savedFormData.file.name : "Geen bestand geselecteerd";
      customImagePreview.innerHTML = savedFormData.file ? `<img src="${URL.createObjectURL(savedFormData.file)}" alt="Selected Image">` : "";
    }
  }
}

function saveFormData() {
  const formData = {
    title: titleInput.value,
    description: descriptionTextarea.value,
    themes: [],
    imageLink: imageLinkInput.value,
    file: fileInput.files[0]
  };

  if (themeCheckboxes) {
    themeCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        formData.themes.push(checkbox.value);
      }
    });
  }

  localStorage.setItem(localStorageKey, JSON.stringify(formData));
}

function updateSelectedOptionText() {
  const selectedThemes = Array.from(themeCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  themeCheckboxes.forEach((checkbox) => {
    checkbox.disabled = selectedThemes.length >= maxThemes && !checkbox.checked;
  });
}

function updateFormData() {
  const selectedCheckboxes = Array.from(themeCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const selectedThemes = themes
    .filter((theme) => selectedCheckboxes.includes(theme.id))
    .map((theme) => theme.label);

  selectedOption.textContent = selectedThemes.length > 0 ? selectedThemes.join(", ") : "Selecteer de passende thema's";
}

function showDialog(event) {
  event.preventDefault();
  uploadDialog.showModal();
}

function closeDialog(event) {
  event.preventDefault();
  uploadDialog.close();
}

function imgCloseDialog(event) {
  event.preventDefault();
  uploadDialog.close();
}

function handleCheckboxChange() {
  updateFormData();
}

function handleFileInputChange() {
  const file = fileInput.files[0];

  if (file) {
    selectedFileName.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Selected Image';
      customImagePreview.innerHTML = '';

      const closeButton = document.querySelector('button');
      closeButton.classList.add('close-button');
      closeButton.innerHTML = '&times;'; // Use × symbol as the close icon

      closeButton.addEventListener('click', function () {
        fileInput.value = '';
        customImagePreview.innerHTML = '';
        selectedFileName.textContent = 'Geen bestand geselecteerd';
        closeButton.remove();
      });

      customImagePreview.appendChild(img);
      customImagePreview.appendChild(closeButton);
    };

    reader.readAsDataURL(file);
  } else {
    selectedFileName.textContent = 'Geen bestand geselecteerd';
    customImagePreview.innerHTML = '';
  }
}

function handleSelectedOptionClick() {
  dropdownMenu.classList.toggle('show');
  selectedOption.classList.toggle('open');
}

// ------------------ event listeners -------------------------------------------------------
if (themeCheckboxes) {
  themeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
  });
}

if (fileInput) {
  fileInput.addEventListener('change', handleFileInputChange);
}

if (selectedOption) {
  selectedOption.addEventListener('click', handleSelectedOptionClick);
}

if (closeDialogButton) {
  closeDialogButton.addEventListener('click', closeDialog);
}

if (imgCloseDialogButton) {
  imgCloseDialogButton.addEventListener('click', imgCloseDialog);
}

// Call initial functions
loadFormData();
updateSelectedOptionText();
updateFormData();

// Export the necessary functions
export {
  showDialog,
  closeDialog,
  imgCloseDialog,
  handleSelectedOptionClick,
  handleCheckboxChange,
  updateFormData,
  saveFormData
};
