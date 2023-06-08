// ------------------ variables -------------------------------------------------------

const socket = io();

import { messages, submitMessage, input, tabs, filterMenu, themeFilterBtn, themeSelect, asideItems, theMenuButton } from "./modules/variables.js";
import { toggleFilterMenu } from "./modules/filter.js";
import { toggleMenu } from "./modules/navigationMenu.js";



let last;

console.log("tabs", tabs);
console.log("themeSelect", themeSelect);

// ------------------ logic -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const selectedOption = document.querySelector(".selected-option");
  const dropdownMenu = document.getElementById("themeDropdownMenu");
  const localStorageKey = "formData";
  console.log("selectedOption", selectedOption);

  selectedOption.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });

  function updateFormData() {
    const checkboxes = document.querySelectorAll(
      "#themeDropdownMenu input[type='checkbox']"
    );
    const selectedThemes = [];
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        selectedThemes.push(checkbox.value);
      }
    });
    selectedOption.textContent =
      selectedThemes.length > 0
        ? selectedThemes.join(", ")
        : "Selecteer de passende thema's";

    const formData = {
      titel: document.getElementById("titel").value,
      beschrijving: document.getElementById("beschrijving").value,
      themas: selectedThemes,
    };

    // Save form data to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(formData));
  }

  const themeCheckboxes = document.querySelectorAll(
    "#themeDropdownMenu input[type='checkbox']"
  );
  themeCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateFormData);
  });

  // Retrieve form data from localStorage
  const savedFormData = localStorage.getItem(localStorageKey);
  if (savedFormData) {
    const parsedFormData = JSON.parse(savedFormData);

    // Set the saved values in the corresponding form fields
    document.getElementById("titel").value = parsedFormData.titel;
    document.getElementById("beschrijving").value = parsedFormData.beschrijving;

    parsedFormData.themas.forEach(function (theme) {
      const checkbox = document.querySelector(
        `#themeDropdownMenu input[type='checkbox'][value='${theme}']`
      );
      if (checkbox) {
        checkbox.checked = true;
      }
    });
    updateFormData();
  }
});

if (asideItems.length > 0) {
  asideItems.forEach((asideItem) => {
    asideItem.addEventListener("click", () => {
      console.log("click");
      asideItem.classList.toggle("active");
    });
  });
}

if (tabs) {
  toggleFilterMenu();
}

if (submitMessage) {
  submitMessage.addEventListener("click", (event) => {
    event.preventDefault();

    // Get the current time.
    const hour = new Date().toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (input.value) {
      // Emit the message to all connected users.
      socket.emit("message", {
        message: input.value,
        // name: nameTitle.textContent,
        time: hour,
      });

      // Add the message to the chat.
      add(input.value, hour, socket.id, true);

      input.value = "";
    }
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

// filter menu


if (theMenuButton) {
  theMenuButton.addEventListener("click", toggleMenu);
}

// ------------------ sockets -------------------------------------------------------

socket.on("message", (message) => {
  if (message.id != socket.id) {
    add(message.message, message.time, message.id);
  }
});

socket.on("history", (history) => {
  history.forEach((message) => {
    add(message.message, message.time, message.id);
  });
});

// ------------------ functions -------------------------------------------------------

function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}
// hamburger
// function toggleMenu() {
//   theNav.classList.toggle("open");
//   theMenuButton.classList.toggle("menuOpen");
//   console.log("open");
//   theImage.classList.toggle("menuOpen");
// }

// function toggleFilterMenu() {
//   tabs.forEach((tab) => {
//     const target = document.querySelector(tab.dataset.filterTarget);
//     tab.addEventListener("click", (e) => {
//       e.preventDefault();
//       tabContents.forEach((tabContent) =>
//         tabContent.classList.remove("active")
//       );
//       target.classList.add("active");
//     });

//     filterThemeBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       target.classList.remove("active");
//       console.log("form submitted");
//     });
//     filterSortBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       target.classList.remove("active");
//       console.log("form submitted");
//     });

//     closeFilterBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       target.classList.remove("active");
//       console.log("form submitted");
//     });
//   });
// }

function add(message, time, id, self) {
  let styling = "";

  // Add styling to the message if you are the sender.
  if (self) {
    styling = "self";
  } else {
    if (last == id) {
      styling = "multiple";
    }
  }

  messages.appendChild(
    Object.assign(document.createElement("li"), {
      className: styling,
      innerHTML: `<section id='message'>
    <span class="message">${message}</span>
    <span class="time">${time}</span> 
    </section>`,
    })
  );
  // Scroll to the bottom of the chat.
  messages.scrollTop = messages.scrollHeight;
  last = id;
}

// function previewFilterItems(){
//   console.log('filter items');
//   const filterItems = document.querySelectorAll('.theme-filter-items li, .sorting-filter-items li');
//   let selectedFilterItems = [];
//   console.log('filter items', filterItems);
//   filterItems.forEach(filterItem => {
//     filterItem.addEventListener('click', (e) => {

//       e.preventDefault();
//     })
//   })
// }
