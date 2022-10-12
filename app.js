// DOM elements
const popUp = document.querySelector('.pop-up');
const form = document.querySelector('form');
const heading = document.querySelector('.heading');
const btnNewBook = document.querySelector('#addBook-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const list = document.querySelector('.list');
const table = document.querySelector('.table-box');
const addBookDiv = document.querySelector('.add-book-div');
const clearBtn = document.querySelector('.clear-list-btn');

// Empty array to store books
let myLibrary = [];

let editMode = false;

// Create Book Class
class Book {
  constructor(author, title, pages, read) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
  }
}

// Get books from Local Storage
function getLibrary() {
  if (localStorage.getItem('myLibrary') === null) {
    myLibrary = [];
  } else {
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    table.classList.add('show');
  }
  return myLibrary;
}

document.addEventListener('DOMContentLoaded', () => {
  getLibrary();
  if (table.classList.contains('show') && !myLibrary.length) {
    table.classList.remove('show');
  }

  let toggleClass;
  for (let i = 0; i < myLibrary.length; i++) {
    myLibrary[i].read === 'yes'
      ? (toggleClass = 'fa-toggle-on')
      : (toggleClass = 'fa-toggle-off');

    let row = document.createElement('tr');
    row.setAttribute('id', `${i}`);
    row.classList.add('row');
    row.innerHTML = `
      <td><input type="text" value="${myLibrary[i].author}" readonly></input></td>
      <td><input type="text" value="${myLibrary[i].title}" readonly></input></td>
      <td><input class="pages" type="number" value="${myLibrary[i].pages}" readonly></td>
      <td>${myLibrary[i].read}</td>
      <td><i class="fa ${toggleClass}"></i></td>
      <td><i class="fa fa-pencil" aria-hidden="true"></i></td>
      <td><i class="fa fa-trash" aria-hidden="true"></i>`;
    list.appendChild(row);
  }
});

// Add new book
btnNewBook.addEventListener('click', () => {
  popUp.classList.add('show');
  heading.classList.add('hide');
  addBookDiv.classList.add('hide');
  table.classList.remove('show');
});

function showHideTable() {
  if (!myLibrary.length) {
    // table.classList.remove('show');
    clearBtn.classList.remove('show');
  } else {
    // table.classList.add('show');
    clearBtn.classList.add('show');
  }
}

cancelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // showHideTable();
  addBookDiv.classList.remove('hide');
  heading.classList.remove('hide');
  popUp.classList.remove('show');
  table.classList.remove('show');
  form.reset();
});

// Submit popup form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Hide popup and show home page
  addBookDiv.classList.remove('hide');
  heading.classList.remove('hide');
  popUp.classList.remove('show');

  // Get user input values
  let author = document.querySelector('#author').value;
  let title = document.querySelector('#title').value;
  let pages = document.querySelector('#num-pages').value;
  let read = getReadStatus();

  // Instantiate new book
  const book = new Book(author, title, pages, read);

  // Push book to the library, show it on the UI
  myLibrary.push(book);
  renderBook();

  // Add book to Local Storage
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));

  // Show success alert
  showAlert();

  // Clear form
  form.reset();
});

// Delete whole list
clearBtn.addEventListener('click', () => {
  // Show popup
  swal('Are you sure you want to clear the list?', {
    buttons: ['Cancel', 'Yes'],
  }).then((val) => {
    if (val) {
      swal({
        title: 'Thanks!',
        text: 'Your list is now empty',
        icon: 'success',
      });

      myLibrary.splice(0);
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
      table.classList.remove('show');
      clearBtn.classList.remove('show');
    }
  });
});

function renderBook() {
  let row = document.createElement('tr');

  myLibrary.forEach((value, index) => {
    let toggleClass;

    // Display toggle icon on or off
    value.read === 'yes'
      ? (toggleClass = 'fa-toggle-on')
      : (toggleClass = 'fa-toggle-off');

    row.setAttribute('id', `${index}`);
    row.classList.add('row');
    row.innerHTML = `
      <td><input type="text" value="${value.author}" readonly></input></td>
      <td><input type="text" value="${value.title}" readonly></input></td>
      <td><input type="number" value="${value.pages}" readonly></input></td>
      <td>${value.read}</td>
      <td><i class="fa ${toggleClass}"></i></td>
      <td><i class="fa fa-pencil" aria-hidden="true"></i></td>
      <td><i class="fa fa-trash" aria-hidden="true"></i></td>`;
    list.appendChild(row);
  });
}

function getReadStatus() {
  const radioBtn = document.querySelectorAll('input[name="radio"]');
  let selectValue;

  for (const i of radioBtn) {
    if (i.checked) {
      selectValue = i.value;
    }
  }
  return selectValue;
}

// Show alert message
function showAlert() {
  const messageDiv = document.querySelector('.message-success');
  messageDiv.classList.add('show');

  setTimeout(() => messageDiv.classList.remove('show'), 2000);
}

list.addEventListener('click', (e) => {
  e.preventDefault();

  // Delete book
  if (e.target.classList.contains('fa-trash')) {
    // Show popup
    swal('Are you sure you want to delete the book?', {
      buttons: ['Cancel', 'Yes'],
    }).then((val) => {
      if (val) {
        swal({
          title: 'Thanks!',
          text: 'You deleted the item',
          icon: 'success',
        });

        let bookToRemove = e.target.parentElement.parentElement;
        bookToRemove.remove();

        // Remove book from Local Storage
        removeBookFromStorage(e.target);
      }
    });
  }

  // Edit mode
  if (e.target.classList.contains('fa-pencil') && !editMode) {
    editMode = true;
    let parent = e.target.parentElement.parentElement;
    parent.classList.add('edit-mode');
    const items = parent.querySelectorAll('input');
    items.forEach((item) => {
      item.classList.add('edit');
      item.readOnly = false;
    });

    e.target.classList.remove('fa-pencil');
    e.target.classList.add('fa-check');

    // Save edited book
  } else if (e.target.classList.contains('fa-check') && editMode) {
    editMode = false;
    let parent = e.target.parentElement.parentElement;
    parent.classList.remove('edit-mode');

    const items = parent.querySelectorAll('input');
    items.forEach((item) => {
      item.classList.remove('edit');
      item.readOnly = true;
    });

    e.target.classList.remove('fa-check');
    e.target.classList.add('fa-pencil');
    let book = e.target.closest('.row');
    book.classList.add('saved');
    setTimeout(() => book.classList.remove('saved'), 1000);
    updateLocalStorage(book);
  }

  // Toggle read status
  let valToUpdate;
  if (e.target.classList.contains('fa-toggle-on')) {
    valToUpdate = e.target.parentElement.previousElementSibling;
    e.target.classList.remove('fa-toggle-on');
    e.target.classList.add('fa-toggle-off');
    valToUpdate.innerHTML = 'no';
    updateLocalStorageToggle(e.target, valToUpdate);
  } else if (e.target.classList.contains('fa-toggle-off')) {
    valToUpdate = e.target.parentElement.previousElementSibling;
    e.target.classList.remove('fa-toggle-off');
    e.target.classList.add('fa-toggle-on');
    valToUpdate.innerHTML = 'yes';
    updateLocalStorageToggle(e.target, valToUpdate);
  }
});

// Remove book from Local Storage
function removeBookFromStorage(book) {
  getLibrary();

  for (let i = 0; i < myLibrary.length; i++) {
    if (i == book.id) {
      myLibrary.splice(i, 1);
    }
  }

  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Update read status in LS
function updateLocalStorageToggle(book, value) {
  getLibrary();

  for (let i in myLibrary) {
    if (i === book.parentElement.parentElement.id) {
      myLibrary[i].read = value.innerHTML;
    }
  }

  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Update edited book in LS
function updateLocalStorage(book) {
  getLibrary();

  let editedArr = [];
  for (let i = 0; i <= book.children.length; i++) {
    if (i < 3) {
      editedArr.push(book.children[i].firstChild.value);
    }
  }

  myLibrary.forEach((el, index) => {
    if (book.id == index) {
      el.author = editedArr[0];
      el.title = editedArr[1];
      el.pages = editedArr[2];
    }
  });

  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}
