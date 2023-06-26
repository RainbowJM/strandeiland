// ------------------ variables -------------------------------------------------------
import { messages, submitMessage, input, tabs, filterMenu, themeFilterBtn, themeSelect, asideItems, theMenuButton, typingElement, selectedOption, dropdownMenu, localStorageKey, themeCheckboxes, fileInput, 
  customImagePreview, selectedFileName, popupCloseButton, popup, savedFormData, imageLinkInput, imagePreview, filterThemeBtn, uploadButton, boxes, titleInput, descriptionTextarea, helperIconValue, votersIconValue, ambassadorsIconValue} from "./modules/variables.js";
import { toggleFilterMenu } from "./modules/filter.js";
import { toggleMenu } from "./modules/navigationMenu.js";
import { addRandomHelperValue, addRandomVoters, addRandomAmbassadors } from "./modules/dynamicIconData.js";


const socket = io();
let last;


// ------------------ logic -------------------------------------------------------
if (uploadButton) {
uploadButton.addEventListener("click", handleUploadButtonClick);
}
if (popupCloseButton) {
  popupCloseButton.addEventListener("click", handlePopupCloseButtonClick);
}

if (selectedOption) {
selectedOption.addEventListener("click", handleSelectedOptionClick);
}

if (themeCheckboxes) {
themeCheckboxes.forEach(function(checkbox) {
  checkbox.addEventListener("change", handleCheckboxChange);
});
}

if (savedFormData) {
  const parsedFormData = JSON.parse(savedFormData);

  document.getElementById("title").value = parsedFormData.title;
  document.getElementById("description").value = parsedFormData.description;

  parsedFormData.themas.forEach(function(theme) {
    const checkbox = document.querySelector(`#themeDropdownMenu input[type='checkbox'][value='${theme}']`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
  updateFormData();
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
        closeButton.innerHTML = "&times;"; 
  
        closeButton.addEventListener("click", function() {
          fileInput.value = "";
  
          customImagePreview.innerHTML = "";
          selectedFileName.textContent = "Geen bestand geselecteerd";
  
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

if (titleInput) {
  titleInput.addEventListener('input', function() {
    if (titleInput.value.trim() === '') {
      titleInput.setCustomValidity('Please enter a title');
    } else {
      titleInput.setCustomValidity('');
    }
  });
}
if (descriptionTextarea) {
  descriptionTextarea.addEventListener('input', function() {
    if (descriptionTextarea.value.trim() === '') {
      descriptionTextarea.setCustomValidity('Please enter a description');
    } else {
      descriptionTextarea.setCustomValidity('');
    }
  });
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
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const submitButton = document.querySelector('.submit-button');
  const loadingState = document.querySelector('#loadingState');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    submitButton.classList.add('hidden');
    loadingState.classList.remove('hidden');

    setTimeout(function() {
      form.submit();
      console.log('loading')
    }, 2000);
  });
});


boxes.forEach(box => {
  box.addEventListener('click', function() {
    const boxElement = box.querySelector('.box');
    boxElement.classList.toggle('show');
    console.log('click')
  });
});


function handleSelectedOptionClick() {
  dropdownMenu.classList.toggle("show");
  selectedOption.classList.toggle('open');
}

function handleUploadButtonClick() {
  popup.classList.remove("hidden");

}

function handlePopupCloseButtonClick(event) {
  event.preventDefault(); 
  popup.classList.add("hidden");
}

function handleCheckboxChange() {
  updateFormData();
}

function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}

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
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    themes: selectedThemes
  };

  localStorage.setItem(localStorageKey, JSON.stringify(formData));
}





