// DOM elements
const form = document.querySelector('.form');
const addBtn = document.querySelector('#add-btn');
const btnNewBook = document.querySelector('#addBook-btn');
const cancelBtn = document.querySelector('#cancel-btn');
const list = document.querySelector('.list');
const table = document.querySelector('.table-box');
const addBookDiv = document.querySelector('.add-book-div');

// Empty array to store books
let myLibrary = [];

// Create Book Class
class Book {
  constructor(author, title, pages, read) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
  }
}

// Load page event listener
document.addEventListener('DOMContentLoaded', () => {
  getLibrary();

  let row;
  for (let b of myLibrary) {
    row = document.createElement('tr');
    row.innerHTML = `<td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.pages}</td>
      <td>${b.read}</td>
      <td><button class="toggle">Change read status</button></td>
      <td><a href="#" class="btn delete">X</a></td>`;
    list.appendChild(row);
  }
});

// Get books from array in Local Storage
function getLibrary() {
  if (localStorage.getItem('myLibrary') === null) {
    myLibrary = [];
  } else {
    myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
  }
  return myLibrary;
}

// Event listener for add book button
btnNewBook.addEventListener('click', () => {
  form.style.display = 'block';
  table.style.display = 'none';
  addBookDiv.style.display = 'none';
});

// Event listener submit form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Hide form and show home page
  table.style.display = 'block';
  addBookDiv.style.display = 'block';
  form.style.display = 'none';

  // Get user input values
  let title = document.querySelector('#title').value;
  let author = document.querySelector('#author').value;
  let pages = document.querySelector('#num-pages').value;
  let read = getRead();

  // Instantiate new book
  const book = new Book(author, title, pages, read);

  // Push book to the library, show it on the UI and clear the form
  myLibrary.push(book);

  // Create table and display the book
  const row = document.createElement('tr');
  myLibrary.forEach((value) => {
    // Add the book to the table
    row.innerHTML = `
      <td>${value.title}</td>
      <td>${value.author}</td>
      <td>${value.pages}</td>
      <td id="yes-no-value">${value.read}</td>
      <td><button class="toggle">Change read status</button></td>
      <td><a href="#" class="btn delete">X</a></td>`;
  });
  list.appendChild(row);

  // Add book to Local Storage
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));

  // Show success alert
  showAlert('Book added!', 'success');

  // Clear form
  form.reset();
});

function getRead() {
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
function showAlert(message, className) {
  const div = document.createElement('div');
  div.className = `alert ${className}`;
  const textMessage = document.createTextNode(message);
  div.appendChild(textMessage);
  const container = document.querySelector('.main-div');
  document.body.insertBefore(div, container);

  // Clear the alert after 2 seconds
  setTimeout(() => document.querySelector('.alert').remove(), 2000);
}

// Event listener when clicking RETURN button
cancelBtn.addEventListener('click', (e) => {
  e.preventDefault();
  table.style.display = 'block';
  addBookDiv.style.display = 'block';
  form.style.display = 'none';
  form.reset();
});

// Event listener for delete item and toggle switch button
list.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.classList.contains('delete')) {
    // Show popup
    swal('Are you sure you want to do this?', {
      buttons: ['Cancel', 'Yes'],
    }).then((val) => {
      if (val) {
        swal({
          title: 'Thanks!',
          text: 'You deleted the item',
          icon: 'success',
        });
        e.target.parentElement.parentElement.remove();
        // Remove book from Local Storage
        removeBookFromStorage(e.target);
      }
    });
  }

  // Toggle button Yes/No for the read value
  if (e.target.classList.contains('toggle')) {
    valToUpdate = e.target.parentElement.previousElementSibling;
    bookToUpdate =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling;

    if (valToUpdate.innerHTML == 'yes') {
      valToUpdate.innerHTML = 'no';
      updateLocalStorage(bookToUpdate, valToUpdate);
    } else {
      valToUpdate.innerHTML = 'yes';
      updateLocalStorage(bookToUpdate, valToUpdate);
    }
  }
});

// Remove book from Local Storage
function removeBookFromStorage(book) {
  // Get books from LS
  getLibrary();
  // Get the title of the targeted book
  let bookToRemove =
    book.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.previousElementSibling.previousElementSibling
      .innerHTML;

  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].title === bookToRemove) {
      myLibrary.splice(i, 1);
    }
  }
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Update read value from LS
function updateLocalStorage(book, value) {
  getLibrary();

  for (let i in myLibrary) {
    let val = myLibrary[i].title;
    // If the book title is the same then set the read value of the same book equals to the value of the toggle
    if (val == book.innerHTML) {
      myLibrary[i].read = value.innerHTML;
    }
  }
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}
