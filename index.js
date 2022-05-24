const form = document.querySelector('#bookForm');
const inputs = document.querySelectorAll('input');
const isReadCheck = document.querySelector('#isRead');
const section = document.querySelector('#section');

function Book(bookInfo) {
    [this.author, this.title, this.numberOfPages, this.isRead] = bookInfo;
    this.bookId = null
}

Book.prototype.generateBookId = function (id) {
    this.bookId = id
}

function addBookToLibrary(e) {
    let myLibrary = fetchBookFromLocalStorage();
    let booksArray = [];

    for (let input of inputs) {
        if (input.id == "isRead") {
            input.value = input.checked
        }

        booksArray.push(input.value)
    }

    // Create new book instance
    const book = new Book(booksArray)
    // Create book id
    book.generateBookId(myLibrary.length > 0 ? myLibrary[myLibrary.length - 1].bookId + 1 : 0);
    myLibrary.push(book)
    addBookToLocalStorage(myLibrary)
    displayBook([book])

    e.preventDefault()
}

function addBookToLocalStorage(book) {
    localStorage.setItem('books', JSON.stringify(book));
}

function fetchBookFromLocalStorage() {
    let bookList = [];

    if (localStorage.getItem('books') !== null) {
        // Fetch book data from local storage
        bookList = JSON.parse(localStorage.getItem('books'))
    }

    return bookList;
}

function updateBookReadStatus(e) {
    let bookList = fetchBookFromLocalStorage();
    let checkBoxId = e.target.id;

    for(let book of bookList) {
        if(book.bookId == checkBoxId) {
            book.isRead = e.target.checked.toString()
        }
    }

    addBookToLocalStorage(bookList)
}

function deleteBookFromLibrary(e) {
    let bookList = fetchBookFromLocalStorage();
    let item = document.querySelector(`#book-${e.target.id}`);
    let filterBooks = bookList.filter(book => book.bookId != e.target.id);

    if (filterBooks.length != 0) {
        addBookToLocalStorage(filterBooks)
    }

    if (filterBooks.length == 0) {
        localStorage.removeItem('books')
    }

    // Remove selected book element from DOM
    section.removeChild(item)
}

function displayBook(data) {
    const books = data;

    for (let book of books) {
        let card = document.createElement('div');
        let title = document.createElement('h3');
        let author = document.createElement('p');
        let pageCount = document.createElement('small');
        let div = document.createElement('div');
        let label = document.createElement('label');
        let inputCheckBox = document.createElement('input');
        let deleteBtn = document.createElement('button');

        setPropertyToElement(card, { id: `book-${book.bookId}`, className: 'card' })
        setPropertyToElement(deleteBtn, { id: book.bookId, textContent: 'Delete' })
        setPropertyToElement(div, { id: 'read-status' })
        setPropertyToElement(label, { className: 'card-label' })
        setPropertyToElement(inputCheckBox, {
            type: 'checkbox',
            id: book.bookId,
            name: `read-status-${book.bookId}`,
            checked: (book.isRead === "true") ? true : false
        })
        section.appendChild(card)
        div.append(label, inputCheckBox)
        card.append(title, author, pageCount, div, deleteBtn)
        title.textContent = book.title.toUpperCase()
        author.textContent = `by ${book.author}`
        pageCount.textContent = `Number of pages ${book.numberOfPages}`
        label.textContent = `Read status of a book`
        deleteBtn.addEventListener('click', deleteBookFromLibrary)
        inputCheckBox.addEventListener('click', updateBookReadStatus)
    }
}

function setPropertyToElement(element, properties) {
    for (let propertyValue in properties) {
        element[propertyValue] = properties[propertyValue]
    }
}

displayBook(fetchBookFromLocalStorage())
form.addEventListener('submit', addBookToLibrary);