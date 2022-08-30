const UNREAD_BOOK_LIST_ID = "incompleteBookshelfList";
const READ_BOOK_LIST_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
    const unreadBookList = document.getElementById(UNREAD_BOOK_LIST_ID);
    const readBookList = document.getElementById(READ_BOOK_LIST_ID);

    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const bookIsRead = document.getElementById('inputBookIsComplete').checked;

    const bookList = createBook(titleBook, authorBook, yearBook, bookIsRead);
    const listBookObject = generateListBookObject(titleBook, authorBook, yearBook, bookIsRead);

    bookList[BOOK_ITEMID] = listBookObject.id;
    books.push(listBookObject);

    if (!bookIsRead) {
        unreadBookList.append(bookList);
    } else {
        readBookList.append(bookList);
    }

    updateDataToStorage();

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function changeSubmitLabel() {
    const labelIsComplete = document.getElementById("inputBookIsComplete");
    if (labelIsComplete.checked){
        let newLabel = document.getElementById("labelIsComplete");
        newLabel.innerText = "Selesai dibaca";
    } else {
        let newLabel = document.getElementById("labelIsComplete");
        newLabel.innerText = "Belum Selesai dibaca";
    }
}
document.getElementById("inputBookIsComplete").addEventListener('change', changeSubmitLabel);

const searchButton = document.getElementById('searchSubmit');
searchButton.addEventListener('click', (event) => {
    const searchBookTitle = document.getElementById('searchBookTitle').value;
    const searchBookList = document.querySelectorAll('article');

    for (title of searchBookList) {
        const book = title.childNodes[0].innerText.toLowerCase();

        if (book.indexOf(searchBookTitle) != -1) {
            title.style.display = "";
            console.log("Proses Berhasil");
        } else {
            title.style.display = "none";
        }
    }

    event.preventDefault();
});

function createBook(data, author, year, isFinished) {
    const listBookTitle = document.createElement('h3');
    listBookTitle.innerText = data;

    const listBookAuthor = document.createElement('p');
    listBookAuthor.innerText = author;

    const listBookYear = document.createElement('p');
    listBookYear.classList.add('year');
    listBookYear.innerText = year;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    if (isFinished == false) {
        actionContainer.append(createReadButton(), createRemoveButton());
    } else {
        actionContainer.append(createUnreadButton(), createRemoveButton());
    }

    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.append(listBookTitle, listBookAuthor, listBookYear);

    bookItem.append(actionContainer);

    return bookItem;
}

function addBookToFinished(taskElement) {
    const finishedBookList = document.getElementById(READ_BOOK_LIST_ID);
    const taskBookTitle = taskElement.querySelector('.book_item > h3').innerText;
    const taskBookAuthor = taskElement.querySelector('.book_item > p').innerText;
    const taskBookYear = taskElement.querySelector('.book_item > .year').innerText;

    const newBook = createBook(taskBookTitle, taskBookAuthor, taskBookYear, true);
    const bookList = findBook(taskElement[BOOK_ITEMID]);
    bookList.isFinished = true;
    newBook[BOOK_ITEMID] = bookList.id;

    finishedBookList.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function removeBook(taskElement) {
    const bookPos = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPos, 1);

    if (confirm("Apakah Anda akan menghapus buku ini ?")) {
        taskElement.remove();
        alert('Buku telah berhasil dihapus');
        updateDataToStorage();
    }
}

function removeBookFromFinished(taskElement) {
    const unfinishedBookList = document.getElementById(UNREAD_BOOK_LIST_ID);
    const taskBookTitle = taskElement.querySelector('.book_item > h3').innerText;
    const taskBookAuthor = taskElement.querySelector('.book_item > p').innerText;
    const taskBookYear = taskElement.querySelector('.book_item > .year').innerText;

    const newBook = createBook(taskBookTitle, taskBookAuthor, taskBookYear, false);
    const bookList = findBook(taskElement[BOOK_ITEMID]);
    bookList.isFinished = false;
    newBook[BOOK_ITEMID] = bookList.id;

    unfinishedBookList.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function createButton(buttonTypeClass, buttonTitle, eventListener) {
    const button = document.createElement('button');
    button.title = buttonTitle;
    button.classList.add(buttonTypeClass);
    // button.innerText = buttonText;
    button.addEventListener('click', function (event) {
        eventListener(event);
    });

    return button;
}

function createReadButton() {
    return createButton('mark', 'Mark as Read', function (event) {
        addBookToFinished(event.target.parentElement.parentElement);
    });
}

function createUnreadButton() {
    return createButton('unmark', 'Mark as Unread', function (event) {
        removeBookFromFinished(event.target.parentElement.parentElement);
    });
}

function createRemoveButton() {
    return createButton('trash', 'Remove Book', function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}