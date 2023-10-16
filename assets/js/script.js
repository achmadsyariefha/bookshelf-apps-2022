document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById("inputBook");
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        submitBook.reset();
    });

    // if (isStorageExist()) {
    //     loadDataFromStorage();
    // }

    if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener('ondatasaved', () => {
    console.log('Data berhasil disimpan');
});

document.addEventListener('ondataloaded', () => {
    refreshData();
});