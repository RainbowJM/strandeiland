import { helperIconValue, votersIconValue,ambassadorsIconValue } from "./variables.js";

function addRandomHelperValue() {
    helperIconValue.forEach(value => {
        value.textContent = Math.floor(Math.random() * 100);
    });
}

function addRandomVoters() {
    votersIconValue.forEach(value => {
        value.textContent = Math.floor(Math.random() * 1500);
    });
}

function addRandomAmbassadors() {
    ambassadorsIconValue.forEach(value => {
        value.textContent = Math.floor(Math.random() * 10);
    });
}

export { addRandomHelperValue, addRandomVoters, addRandomAmbassadors }