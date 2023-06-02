const socket = io();
const messages = document.querySelector("section ul");
const input = document.querySelector("input");
const filterMenu = document.querySelector(".filter-menu");
const themaFilterBtn = document.querySelector(".thema-btn");
const themeSelect = document.getElementById("thema");

themaFilterBtn.addEventListener("click", () => {
  filterMenu.classList.toggle("show-filter");
});

themeSelect.addEventListener("change", function () {
  displaySelectedOption(themeSelect);
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    input.value = "";
  }
});

socket.on("message", (message) => {
  addMessage(message);
});

socket.on("whatever", (message) => {
  addMessage(message);
});

socket.on("history", (history) => {
  history.forEach((message) => {
    addMessage(message);
  });
});

function addMessage(message) {
  messages.appendChild(
    Object.assign(document.createElement("li"), { textContent: message })
  );
  messages.scrollTop = messages.scrollHeight;
}

function displaySelectedOption(selectElement) {
  let selectedOption = selectElement.options[selectElement.selectedIndex].text;
  selectElement.value = selectedOption;
}
