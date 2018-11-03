
const model = {
    apiUrl : 'https://www.googleapis.com/books/v1/volumes', 
    keywork : 'javascript',
    currentBook: {},
    books: []
}

const controller = {
    init: function () {
        this.retrieveBookFromAPI();
        bookView.init();
    },
    retrieveBookFromAPI: function (startIndex = 0) {
        console.log(startIndex);
        console.log(model.keywork);
        fetch(`${model.apiUrl}?q=${model.keywork}&startIndex=${startIndex}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (books) {
                model.books = books.items;
                model.currentBook = books.items[0];
                bookListView.render();
                bookView.render();
            });
    },
    getBooks: function () {
        return model.books;
    },

    getCurrentBook: function () {
        return model.currentBook;
    },
    setCurrentBook: function (name) {
    model.keywork=name;
    this.retrieveBookFromAPI(3);
    bookView.init();
    }
    
}

const bookListView = {
    init: function () {
        this.render();
    },
    render: function () {
        const books = controller.getBooks();
        let htmlData = "";
        books.forEach(function(note) {
            htmlData += `<li class="content" data-content="${note.volumeInfo.title}">
                    ${note.volumeInfo.title} </li>`;
          });
          $("#notes").html(htmlData);
          document.getElementById("notes").addEventListener("click", function (e) {
            
            if (e.target && e.target.nodeName == "LI") {
                controller.setCurrentBook("css3");
                console.log(e.target.id + " was clicked");
            }
        });
        console.log(books);
    },
    setCurrentBook: function () {

    }

}

const bookView = {
    init: function(){
        this.viewport = document.getElementById('viewerCanvas');
        this.render();
    },
    render: function () {
        console.log(controller.getCurrentBook());
        google.books.load();
        google.books.setOnLoadCallback(function(){
            const viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
            const currentBook = controller.getCurrentBook();
            viewer.load(currentBook.id);
        });
    },

}

controller.init();
