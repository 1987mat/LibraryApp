// Book constructor
function Book(author, title, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

let form = document.querySelector('.form');
let addBtn = document.querySelector('#add-btn');
let btnNewBook = document.querySelector('#addBook-btn');
let cancelBtn = document.querySelector('#cancel-btn')
let list = document.querySelector('.list');
let table = document.querySelector('.table-box');
let addDiv = document.querySelector('.add-div');

// Empty array to store books
let myLibrary = [];

// Load page event listener
document.addEventListener('DOMContentLoaded', () => {
  getLibrary();
  let row;
  for (let b of myLibrary) {
      row = document.createElement('tr');
      row.innerHTML =
      `<td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.pages}</td>
      <td>${b.read}</td>
      <td><button class="toggle">Change read status</button></td>
      <td><a href="#" class="btn delete">X</a></td>`;
      list.appendChild(row);
  }
});

// Event handler ADD BOOK button
btnNewBook.addEventListener('click', function() {
    form.style.display = 'block';
    table.style.display = 'none';
    addDiv.style.display = 'none';
});

// Event handler SUBMIT button on the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide form and show home page
    table.style.display = 'block';
    addDiv.style.display = 'block';
    form.style.display = 'none';

    // User input values
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let pages = document.querySelector('#num-pages').value;
    let read = getRead();

    // Instantiate new book
    const book = new Book(author, title, pages, read);

    // Push book to the library, show it on the UI and clear the form
    myLibrary.push(book);
    addBookToList();

    // Add book to Local Storage
    addBookToStorage();

    // Show success alert
    showAlert('Book added!', 'success');

    // Clear form
    form.reset();
});


// Event listener when clicking RETURN button
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    table.style.display = 'block';
    addDiv.style.display = 'block';
    form.style.display = 'none';
    form.reset();
});

// Event handler for delete item and toggle switch button
list.addEventListener('click', e => {
  e.preventDefault();

  if(e.target.classList.contains('delete')) {
    // Show popup
    swal("Are you sure you want to do this?", {
      buttons: ['Cancel', 'Yes'],
    }).then(val => {
      if(val) {
        swal({title: "Thanks!",
              text: "You deleted the item",
              icon: "success"
            });

        e.target.parentElement.parentElement.remove();   
        // Remove book from Local Storage
        removeBookFromStorage(e.target);  
      }
    })        
  }

  // Toggle button Yes/No for the read value
  if(e.target.classList.contains('toggle')) {
      valToUpdate = e.target.parentElement.previousElementSibling;
      bookToUpdate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling;

  if(valToUpdate.innerHTML == 'yes') {
      valToUpdate.innerHTML = 'no';
      updateLocalStorage(this.bookToUpdate, this.valToUpdate);

  } else {
      valToUpdate.innerHTML = 'yes';
      updateLocalStorage(bookToUpdate, valToUpdate);
    }
  }
});


// FUNCTIONS


// Get value of radio button
function getRead() {
  const radioBtn = document.querySelectorAll('input[name="radio"]');
  let selectValue;

  for(const i of radioBtn) {
      if(i.checked) {
          selectValue = i.value;
      }
  }
  return selectValue;
}


// Add book to the UI
function addBookToList() {

  const row = document.createElement('tr');
  myLibrary.forEach(value => {

    // Add the book to the table
    row.innerHTML = `
      <td>${value.title}</td>
      <td>${value.author}</td>
      <td>${value.pages}</td>
      <td id="yes-no-value">${value.read}</td>
      <td><button class="toggle">Change read status</button></td>
      <td><a href="#" class="btn delete">X</a></td>`;

    list.appendChild(row);
  });
}

// Show success message 
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

// Get books from array in Local Storage
function getLibrary() {
    if(localStorage.getItem('myLibrary') === null) {
        myLibrary = [];
    } else {
        myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    }
    return myLibrary;
}

// Add book to Local Storage
function addBookToStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Remove book from Local Storage
function removeBookFromStorage(book) {
    // Get books from LS
    getLibrary();
    // Get the title of the targeted book
    let bookToRemove = book.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    
    for(let i = 0; i < myLibrary.length; i++) {
       if(myLibrary[i].title === bookToRemove) {
          myLibrary.splice(i,1);
       }
    }
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Update read value from LS
function updateLocalStorage(book, value) {
  getLibrary();

  for(let i in myLibrary) {
  
    let val =  myLibrary[i].title;
    // If the book title is the same then set the read value of the same book equals to the value of the toggle
    if(val == book.innerHTML) {
      myLibrary[i].read = value.innerHTML;
    }
  }
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}
