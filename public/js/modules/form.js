import { selectedOption, dropdownMenu, localStorageKey, themeCheckboxes, fileInput, 
  customImagePreview, selectedFileName, savedFormData, imageLinkInput, imagePreview, uploadButton,  titleInput, descriptionTextarea, uploadDialog, closeDialogButton, imgCloseDialogButton} from "./modules/variables.js";

  
  function loadFormDataFromLocalStorage() {
    const localStorageKey = "formData";
    
    if (localStorage.getItem(localStorageKey)) {
      const savedFormData = JSON.parse(localStorage.getItem(localStorageKey));
      
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
      
      const selectedOption = document.querySelector('.selected-option');
      selectedOption.textContent = savedFormData.themes.length > 0 ? savedFormData.themes.join(", ") : "Selecteer de passende thema's";
    }
  }
  
;
  
  
  
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
  
  
    const selectedOption = document.querySelector('.selected-option');
    selectedOption.textContent = formData.themes.length > 0 ? formData.themes.join(", ") : "Selecteer de passende thema's";
  }
  
  
  
  if (titleInput) {
    titleInput.addEventListener("input", saveFormData);
  }
  if (descriptionTextarea) {
    descriptionTextarea.addEventListener("input", saveFormData);
  }
  if (themeCheckboxes) {
    themeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", saveFormData);
    });
  }
  if (imageLinkInput) {
    imageLinkInput.addEventListener("input", () => {
      saveFormData();
      imagePreview.innerHTML = `<img src="${imageLinkInput.value}" alt="">`;
    });
  }
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      saveFormData();
      const file = fileInput.files[0];
      if (file) {
        selectedFileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function (e) {
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
  }
  
  
  
  function updateFormData() {
    const selectedCheckboxes = Array.from(themeCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
    
    
    const selectedThemes = themes
      .filter((theme) => selectedCheckboxes.includes(theme.id))
      .map((theme) => theme.label);
  
    const selectedOption = document.querySelector('.selected-option');
    selectedOption.textContent = selectedThemes.length > 0 ? selectedThemes.join(", ") : "Selecteer de passende thema's";
  
    saveFormData();
  }
  
  
  
  if (themeCheckboxes) {
    themeCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener("change", updateFormData);
    });
  }
  
  
  
  
  
  if (uploadDialog) {
    uploadButton.addEventListener("click", showDialog);
    closeDialogButton.addEventListener("click", closeDialog);
    imgCloseDialogButton.addEventListener("click", imgCloseDialog);
  
  }
  
  
  
  
  if (selectedOption) {
  
  selectedOption.addEventListener("click", handleSelectedOptionClick);
  }
  
  if (themeCheckboxes) {
  
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", handleCheckboxChange);
  });
  }
  
  
  
  
  
  if (uploadButton) {
    uploadButton.addEventListener("click", handleUploadButtonClick);
    }
  
  
  
  
  if (imageLinkInput) {
    imageLinkInput.addEventListener('input', () => {
      imagePreview.innerHTML = `<img src="${imageLinkInput.value}" alt="">`;
    });
    }
  
  if (fileInput) {
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
    
          const closeButton = document.createElement("button");
          closeButton.classList.add("close-button");
          closeButton.innerHTML = "&times;"; // Use × symbol as the close icon
    
  
          closeButton.addEventListener("click", function() {
            // Clear the file input value
  
            fileInput.value = "";
    
            // Clear the image preview
            customImagePreview.innerHTML = "";
            selectedFileName.textContent = "Geen bestand geselecteerd";
    
            // Remove the close button
            closeButton.remove();
          });
    
          customImagePreview.appendChild(img);
          customImagePreview.appendChild(closeButton);
        };
        reader.readAsDataURL(file);
      } else {
        selectedFileName.textContent = "Geen bestand geselecteerd";
        customImagePreview.innerHTML = "";
      }
    });
  }

  // if (titleInput) {
  //   titleInput.addEventListener('input', function() {
  //     if (titleInput.value.trim() === '') {
  //       titleInput.setCustomValidity('Please enter a title');
  //     } else {
  //       titleInput.setCustomValidity('');
  //     }
  //   });
  // }
  // if (descriptionTextarea) {
  //   descriptionTextarea.addEventListener('input', function() {
  //     if (descriptionTextarea.value.trim() === '') {
  //       descriptionTextarea.setCustomValidity('Please enter a description');
  //     } else {
  //       descriptionTextarea.setCustomValidity('');
  //     }
  //   });
  // }

  


function handleSelectedOptionClick() {
  dropdownMenu.classList.toggle("show");
  selectedOption.classList.toggle('open');
}

function handleUploadButtonClick(event) {
  event.preventDefault(); 
}


function handleCheckboxChange() {
  updateFormData();
}

function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}

    
const checkboxes = document.querySelectorAll("#themeDropdownMenu input[type='checkbox']");
  const selectedThemes = [];
selectedOption.textContent = selectedThemes.length > 0 ? selectedThemes.join(", ") : "Selecteer de passende thema's";




function showDialog() {
  uploadDialog.showModal();
}

function closeDialog() {
  uploadDialog.close();
}


function imgCloseDialog() {
  uploadDialog.close();
}

export {showDialog, closeDialog, imgCloseDialog, handleSelectedOptionClick, 
  handleUploadButtonClick, handleCheckboxChange, displaySelectedOption, updateFormData, saveFormData, loadFormDataFromLocalStorage};



