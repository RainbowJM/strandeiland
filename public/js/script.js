const socket = io();

const filterMenu = document.querySelector('.filter-menu');
const themaFilterBtn = document.querySelector('.thema-btn');

themaFilterBtn.addEventListener('click', ()=>{
    filterMenu.classList.toggle('show-filter');
})
