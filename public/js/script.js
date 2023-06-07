const socket = io();
const messages = document.querySelector("section ul");
const filterMenu = document.querySelector(".filter-menu");
const themeFilterBtn = document.querySelector(".thema-btn");
const themeSelect = document.getElementById("thema");
// Aside pop out
const asideItems = document.querySelectorAll(".helpende-item");
const submitMessage = document.querySelector("#message-button");
const input = document.querySelector("#message-input");
const tabs = document.querySelectorAll("[data-filter-target]");
const tabContents = document.querySelectorAll("[data-filter-content]");
const filterThemeBtn = document.querySelector(".filter-theme-btn");
const filterSortBtn = document.querySelector(".filter-sort-btn");
const closeFilterBtn = document.querySelector(".close-filter");

console.log("tabs", tabs);
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
      add(input.value, hour);

      //         if (input.value.charAt(0).toUpperCase() + input.value.slice(1) === currentWordEng) {
      //             correct = true;
      //         }
      //         socket.emit('answer', correct)

      //         // Clear the input field.
      input.value = "";
    }
  });
}

asideItems.forEach((asideItem) => {
  asideItem.addEventListener("click", () => {
    console.log("click");
    asideItem.classList.toggle("active");
  });
});

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

socket.on("message", (message) => {
  add(message.message, message.time);
});

socket.on("history", (history) => {
  history.forEach((message) => {
    add(message.message, message.time);
  });
});

function add(message, time) {
  console.log("app.js", message);
  messages.appendChild(
    Object.assign(document.createElement("li"), {
      // className: styling,
      innerHTML: `<section id='message'>
    <span class="message">${message}</span>
    <span class="time">${time}</span> 
    </section>`,
    })
  );
  // Scroll to the bottom of the chat.
  messages.scrollTop = messages.scrollHeight;
}

function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}

// ------------------ filter menu ------------------
function toggleFilterMenu() {
  tabs.forEach((tab) => {
    const target = document.querySelector(tab.dataset.filterTarget);
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      tabContents.forEach((tabContent) =>
        tabContent.classList.remove("active")
      );
      target.classList.add("active");
    });

    filterThemeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      target.classList.remove("active");
      console.log("form submitted");
    });
    filterSortBtn.addEventListener("click", (e) => {
      e.preventDefault();
      target.classList.remove("active");
      console.log("form submitted");
    });

    closeFilterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      target.classList.remove("active");
      console.log("form submitted");
    });
  });
}
