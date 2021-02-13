// Get values
let formContainer = document.querySelector('.form-div');
let form = document.querySelector('.form');
let addBtn = document.querySelector('#add-btn');
let btnNewBook = document.querySelector('#addBook-btn');
const list = document.querySelector('.list');

// Book constructor
function Book(author, title, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

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
        <td><a href="#" class="btn delete">X</a></td>`;
        list.appendChild(row);
    }
});

// Event listener when clicking ADD BOOK button
btnNewBook.addEventListener('click', function() {
    form.style.display = 'block';
    document.querySelector('.table-box').style.display = 'none';
    document.querySelector('.para-div').style.display = 'none';
});

// Event listener when clicking ADD button on the form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide form and show home page
    document.querySelector('.table-box').style.display = 'block';
    document.querySelector('.para-div').style.display = 'block';
    form.style.display = 'none';
    
    // Get values from User
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let pages = document.querySelector('#num-pages').value;
    let read = getRead();

    // Instantiate book
    const book = new Book(author, title, pages, read);

    // Push book to the library, show it on the UI and clear the form
    myLibrary.push(book);
    addBookToList();

    // Add book to Local Storage
    addBook();

    // Show success alert
    showAlert('Book added!', 'success');

    // Clear form
    form.reset();

});

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

// Storage
function getLibrary() {
    if(localStorage.getItem('myLibrary') === null) {
        myLibrary = [];
    } else {
        myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
    }
    return myLibrary;
}

function addBook() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function removeBook(book) {
    // Get books from LS
    getLibrary();
    // Get the title of the targeted book
    let bookToRemoved = book.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;

    for(let i = 0; i < myLibrary.length; i++) {
       
       if(myLibrary[i].title === bookToRemoved) {
           myLibrary.splice(i,1);
       }
    }
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function addBookToList() {

    // Create new row element
    const row = document.createElement('tr');

    // Loop through myLibrary array
    myLibrary.forEach(value => {

        // Add the book to the table
            row.innerHTML = `
            <td>${value.title}</td>
            <td>${value.author}</td>
            <td>${value.pages}</td>
            <td>${value.read}</td>
            <td><a href="#" class="btn delete">X</a></td>`;
    });
    // Append the row to list
    list.appendChild(row);
}

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

// Remove book from list
document.querySelector('.list').addEventListener('click', e => {
    e.preventDefault();

    if(e.target.classList.contains('delete')) {
        e.target.parentElement.parentElement.remove();
        showAlert('Book removed!', 'removed');     
    }  
    // Remove book from Local Storage
    removeBook(e.target);  
});










