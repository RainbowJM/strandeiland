// ------------------ variables -------------------------------------------------------
import { messages, submitMessage, input, tabs, filterMenu, themeFilterBtn, themeSelect, asideItems, theMenuButton, typingElement, selectedOption, dropdownMenu, localStorageKey, themeCheckboxes, fileInput, 
  customImagePreview, selectedFileName, popupCloseButton, popup, savedFormData, imageLinkInput, imagePreview, filterThemeBtn, uploadButton} from "./modules/variables.js";
import { toggleFilterMenu } from "./modules/filter.js";
import { toggleMenu } from "./modules/navigationMenu.js";

const socket = io();
let last;


// ------------------ logic -------------------------------------------------------
if (uploadButton) {
uploadButton.addEventListener("click", handleUploadButtonClick);
}
// Event listener for closeButton click
if (popupCloseButton) {
  popupCloseButton.addEventListener("click", handlePopupCloseButtonClick);
}

// Event listener for selectedOption click
if (selectedOption) {
selectedOption.addEventListener("click", handleSelectedOptionClick);
}

// Event listener for themeCheckboxes change
if (themeCheckboxes) {
themeCheckboxes.forEach(function(checkbox) {
  checkbox.addEventListener("change", handleCheckboxChange);
});
}

// Retrieve form data from localStorage
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

if (asideItems.length > 0) {
  asideItems.forEach((asideItem) => {
    asideItem.addEventListener("click", () => {
      console.log("click");
      asideItem.classList.toggle("active");
    });
  });
}

if (filterThemeBtn) {
  toggleFilterMenu();
}

if (submitMessage) {
  console.log("submitMessage");
  submitMessage.addEventListener("click", (event) => {
    event.preventDefault();

    // Get the current time.
    const date = new Date().toLocaleString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (input.value) {
      // Emit the message to all connected users.
      socket.emit("message", {
        message: input.value,
        // name has to be fetch from database
        name: "Jane Doe",
        time: date,
      });

      // Add the message to the chat.
      add(input.value, 'Jane Doe', date, socket.id);

      input.value = "";
    }
  });
}

if (input) {
  input.addEventListener('input', event => {
      event.preventDefault();
      // Emit the typing event.
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
      // Empty indicator
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

// Function to handle selectedOption click
function handleSelectedOptionClick() {
  dropdownMenu.classList.toggle("show");
  selectedOption.classList.toggle('open');
}

function handleUploadButtonClick() {
  popup.classList.remove("hidden");

}

   
// Function to handle closeButton click
function handlePopupCloseButtonClick(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  popup.classList.add("hidden");
}


// Function to handle themeCheckboxes change
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


