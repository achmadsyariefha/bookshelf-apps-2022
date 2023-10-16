let books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof(Storage) == undefined) {
        alert('Browser kamu tidak mendukung Local Storage');
        return false
    }

    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);
    if (data !== null) books = data;

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if (isStorageExist()) saveData();
}

// const updateDataToStorage = () => {
//     if (isStorageExist()) saveData();
// }

function generateListBookObject(title, author, year, isFinished) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isFinished
    }
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId) return book;
    }

    return null;
}

function findBookIndex(bookId) {
    let index = 0;

    for (book of books) {
        if (book.id === bookId) return book;
        index++;
    }

    return -1;
}

function refreshData() {
    const listUnreadBooks = document.getElementById(UNREAD_BOOK_LIST_ID);
    const listReadBooks = document.getElementById(READ_BOOK_LIST_ID);

    for (book of books) {
        const newBook = createBook(book.title, book.author, book.year, book.isFinished);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isFinished) {
            listReadBooks.append(newBook);
        } else {
            listUnreadBooks.append(newBook);
        }
    }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
})