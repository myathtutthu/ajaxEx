
const model = {
    apiUrl : 'https://www.googleapis.com/books/v1/volumes', 
    keyword : 'javascript',
    currentBook: {},
    books: [],
    startIndex : 0,
    totalAvailableBooks : 0,
    hasMoreBook : true,
    itemPerPage : 10,
    nextStartIndex : function(){
        return model.startIndex + model.itemPerPage;
    }

}

const controller = {
    init: function () {
        this.retrieveBookFromAPI();
        bookView.init();
        bookListView.init();
        searchBook.init();
    },
    retrieveBookFromAPI: function () {
        console.log(model.startIndex);
        fetch(`${model.apiUrl}?q=${model.keyword}&startIndex=${model.startIndex}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (books) {                
                model.books = model.books.concat(books.items);
                model.currentBook = books.items[0];
                if(books.totalItems < (model.startIndex)){
                model.hasMoreBook=false;
                }else{
                    model.startIndex=model.nextStartIndex();
                }
                console.log(model.startIndex);

                bookListView.render();
                bookView.render();
            });
    },
    getBooks: function () {
        return model.books;
    },
    hasMoreBook : function(){
        return model.hasMoreBook;
    },
    getCurrentBook: function () {
        return model.currentBook;
    },
    setCurrentBook: function (book) {
        model.currentBook = book;
        bookView.render();
    },
    searchBook:function(searchBook){
        model.keyword=searchBook;
        bookListView.clear();
        this.retrieveBookFromAPI();
    },
    loadMore:function(){
        if(model.hasMoreBook){
            this.retrieveBookFromAPI();
        }else{
            alert("no more Book");
        }

    }
}

const bookListView = {
    init: function () {
        this.bookListElem = document.getElementById('bookList');
        this.viewMore = document.getElementById('btnViewMore');
        this.viewMore.addEventListener('click',function(){
        controller.loadMore();
        })
    },
    render: function () {
        this.books = controller.getBooks();        
        this.books.forEach(function(book){            
            bookListView.bookListElem.appendChild(bookListView.buildBook(book));
        });        
    },
    clear:function(){
        model.books=[];
        bookListView.bookListElem.innerHTML="";
    },
    buildBook : function(book){
        const bookDiv = document.createElement('div');
        console.log(book);
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
        <div class="content">
            <img src=${book.volumeInfo.imageLinks.smallThumbnail} alt="${book.volumeInfo.title}">
        </div>
        <div class="title">${book.volumeInfo.title}</div>
        `;
        bookDiv.addEventListener('click',function(){
            controller.setCurrentBook(book);
        });
        return bookDiv;
    }
}

const bookView = {
    init: function(){
        this.viewport = document.getElementById('viewerCanvas');
        google.books.load();
        google.books.setOnLoadCallback(function(){                        
            bookView.render();    
        });
        
    },
    render: function () {
        console.log(controller.getCurrentBook());       
        const viewer = new google.books.DefaultViewer(bookView.viewport);
        const currentBook = controller.getCurrentBook(); 
        viewer.load(currentBook.id);
    },

}
const searchBook={
    init: function() {
        this.btnSearch = document.getElementById('btnSearch');
        this.txtSearch = document.getElementById('txtSearch');
        this.btnSearch.addEventListener('click', function() {
            let searchText = searchBook.txtSearch.value;
            controller.searchBook(searchText);
        })
    }
}


controller.init();
