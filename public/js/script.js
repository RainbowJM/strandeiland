// ------------------ variables -------------------------------------------------------
import { messages, submitMessage, input, tabs, filterMenu, themeFilterBtn, themeSelect, asideItems, theMenuButton, typingElement, selectedOption, dropdownMenu, localStorageKey, themeCheckboxes, fileInput, 
  customImagePreview, selectedFileName, savedFormData, imageLinkInput, imagePreview, filterThemeBtn, uploadButton, boxes, titleInput, descriptionTextarea, helperIconValue, votersIconValue, ambassadorsIconValue, uploadDialog, closeDialogButton, imgCloseDialogButton} from "./modules/variables.js";
import { toggleFilterMenu } from "./modules/filter.js";
import { toggleMenu } from "./modules/navigationMenu.js";
import { addRandomHelperValue, addRandomVoters, addRandomAmbassadors } from "./modules/dynamicIconData.js";


const socket = io();
let last;

const themes = [
  { id: '1', label: 'recreatie' },
  { id: '2', label: 'infrastructuur' },
  { id: '3', label: 'sport' },
  { id: '4', label: 'natuur' },
  { id: '5', label: 'winkel' },
  { id: '6', label: 'milieu' },
  { id: '7', label: 'jeugd' },
  { id: '8', label: 'cultuur' },
  { id: '9', label: 'huisvesting' },
  { id: '10', label: 'veiligheid' },
  { id: '11', label: 'verkeer' },
  { id: '12', label: 'strand' },
  { id: '13', label: 'onderwijs' },
  { id: '14', label: 'over' }
];


// ------------------ logic -------------------------------------------------------
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


  const selectedOption = document.querySelector('.selected-option');
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
if (fileInput && savedFormData && savedFormData.file) {
  selectedFileName.textContent = savedFormData.file.name;
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.alt = "Selected Image";
    
    if (customImagePreview) {
      customImagePreview.innerHTML = "";
      customImagePreview.appendChild(img);
    }
  };
  reader.readAsDataURL(savedFormData.file);
} else if (selectedFileName) {
  selectedFileName.textContent = "Geen bestand geselecteerd";
  
  if (customImagePreview) {
    customImagePreview.innerHTML = "";
  }
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
  
        const closeButton = document.querySelector("button");
        closeButton.classList.add("close-button");
        closeButton.innerHTML = "&times;"; 
  

        closeButton.addEventListener("click", function() {
  

          fileInput.value = "";
  
        
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

if (asideItems.length > 0) {
  asideItems.forEach((asideItem) => {
    asideItem.addEventListener("click", () => {
      asideItem.classList.toggle("active");
    });
  });
}

if (filterThemeBtn) {
  toggleFilterMenu();
}

if (submitMessage) {
  submitMessage.addEventListener("click", (event) => {
    event.preventDefault();

    const date = new Date().toLocaleString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (input.value) {
      socket.emit("message", {
        message: input.value,
        name: "Jane Doe",
        time: date,
      });

      add(input.value, 'Jane Doe', date, socket.id);

      input.value = "";
    }
  });
}

if (input) {
  input.addEventListener('input', event => {
      event.preventDefault();
      socket.emit('typing', {
          name: 'Jane Doe',
          typing: true
      })
      setTimeout(() => {
          socket.emit('typing', {
              name: 'Jane Doe',
              typing: false
          })
      }, 3000)
  });
}

if (themeFilterBtn) {
  themeFilterBtn.addEventListener("click", () => {
    filterMenu.classList.toggle("show-filter");
  });
}

if (themeSelect) {
  themeSelect.addEventListener("change", function () {
    displaySelectedOption(themeSelect);
  });
}

if (theMenuButton) {
  theMenuButton.addEventListener("click", toggleMenu);
}



if (helperIconValue || votersIconValue || ambassadorsIconValue) {
  addRandomHelperValue();
  addRandomVoters();
  addRandomAmbassadors();
}
// ------------------ sockets -------------------------------------------------------

socket.on("message", (message) => {
  if (message.id != socket.id) {
    add(message.message, message.name, message.time, message.id);
  }
});

socket.on("history", (history) => {
  history.forEach((message) => {
    add(message.message, message.name, message.time, message.id);
  });
});

socket.on('typing', (typing) => {
  let names = []

  // Get the names of the users that are typing.
  typing.forEach((client) => {
      if (client[1] != socket.id) {
          // Add the name to the list.
          names.push(client[0])
      }
  })

  if (names.length == 0) {
      typingElement.innerHTML = ""
  } else if (names.length == 1) {
      // Fill the typing indicator with text
      typingElement.innerHTML = `💬${names[0]} is sending a message...`
  } else {
      // Fill the typing indicator with text
      typingElement.innerHTML = `💬${names.slice(0, -1).join(", ")} and ${names.slice(-1)} are sending a message...`
  }
})

// ------------------ functions -------------------------------------------------------

// form loading state
// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.querySelector('form');
//   const submitButton = document.querySelector('.submit-button');
//   const loadingState = document.querySelector('#loadingState');

//   form.addEventListener('submit', function(event) {
//     event.preventDefault();

//     submitButton.classList.add('hidden');
//     loadingState.classList.remove('hidden');

//     setTimeout(function() {
//       form.submit();
//       console.log('loading')
//     }, 2000);
//   });
// });



function add(message, name, time, id) {
  messages.appendChild(
    Object.assign(document.createElement("li"), {
      innerHTML: `<section id='message'>
      <img src="/images/bob.jpeg" alt="avatar" class="avatar">
      <div class="message-name-time">
      <p class="name">${name}</p> 
      <span class="message">${message}</span>
      <span class="time">${time}</span> 
      </div>
      </section>`,
    })
  )
  messages.scrollTop = messages.scrollHeight;
  last = id;
};
  

boxes.forEach(box => {
  box.addEventListener('click', function() {
    const boxElement = box.querySelector('.box');
    boxElement.classList.toggle('show');
  });
});


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
  const savedFormData = JSON.parse(localStorage.getItem(localStorageKey));
  const selectedOptionElement = document.querySelector('.selected-option');

  if (selectedOptionElement) {
    if (savedFormData && savedFormData.themes.length > 0) {
      const selectedThemes = themes
        .filter((theme) => savedFormData.themes.includes(theme.id))
        .map((theme) => theme.label);

      selectedOptionElement.textContent = selectedThemes.join(", ");
    } else {
      selectedOptionElement.textContent = "Selecteer de passende thema's";
    }
  } else {
    console.error("Selected option element not found.");
  }
}

const maxThemes = 4;

let selectedThemes = [];

function updateSelectedOptionText() {
  selectedThemes = Array.from(themeCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  themeCheckboxes.forEach(checkbox => {
    checkbox.disabled = selectedThemes.length >= maxThemes && !checkbox.checked;
  });
}

if (themeCheckboxes && themeCheckboxes.length > 0) {
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      updateSelectedOptionText();
    });
  });
}

updateSelectedOptionText();


if (themeCheckboxes) {
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      updateSelectedOptionText();
    });
  });
}

updateSelectedOptionText();

if (themeCheckboxes) {
  themeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      updateSelectedOptionText();
    
    });
  });
}


updateSelectedOptionText();


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



