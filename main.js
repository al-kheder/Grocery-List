//   ####### SELECTION ########
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");

const groceryContainer = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");

const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

const localStorageKey = "list";
// ##### edit options ######
let editElement;
let editFlag = false;
let editID = "";

// ######### event listeners ########
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

//load items from the local storage
window.addEventListener("DOMContentLoaded", setUpItems);

//  ##########  functions  ##########
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    const element = createListItem(id, value); // ← Now we catch the returned element
    // call them after creating the items (element) - select from the new element
    const editBtn = element.querySelector(".edit-btn");
    const deletetBtn = element.querySelector(".delete-btn");
    deletetBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    displayAlert(`${value} added successfully!`, "success");
    //show container
    groceryContainer.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, value);
    setBackTodefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert(`${value} edited successfully`, "success");
    //edit local storage
    editLocalStorage(editID, value);
    setBackTodefault();
  } else {
    displayAlert(`please enter value`, "danger");
  }
}

//clear items

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
    groceryContainer.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackTodefault();
    //localStorage.remove('list')
    localStorage.clear();
  }
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  removeFromLocalStorage(id);
}

// **** display alert ****
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//set back to default
function setBackTodefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ######## local storage #######
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorageItem(localStorageKey);
  items.push(grocery);
  saveToLocalStorag(localStorageKey, items);
}
function editLocalStorage(id, value) {
  let items = getLocalStorageItem(localStorageKey);
  items = items.map((item) => (item.id === id ? { id, value } : item));
  saveToLocalStorag(localStorageKey, items);
}

function removeFromLocalStorage(id) {
  saveToLocalStorag(
    localStorageKey,
    getLocalStorageItem(localStorageKey).filter((item) => item.id !== id)
  );
}

function getLocalStorageItem(key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
}

//helper function to upadat the local storage when called
function saveToLocalStorag(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ####### setup items ########
function setUpItems() {
  let items = getLocalStorageItem(localStorageKey);
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    groceryContainer.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
                    <p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
               
    `;
  //append child
  list.appendChild(element);
  return element; // ← Return the element so other functions can use it
}
