//Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}
//UI Class
class UI {
    static displayBooks() {
        const books = Store.getBooks()
        books.forEach((book) => UI.AddBookToList(book));
    }

    static AddBookToList(book) {
        const list = document.getElementById("book-list");

        const row = document.createElement("tr");

        row.innerHTML = `<td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
                        `;
        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement("div")

        //it will change with recieving classname
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")

        //inserting it before the form
        container.insertBefore(div, form)

        //vanish in 3sec
        setTimeout(() => document.querySelector(".alert").remove(), 3000)
    }

    static clearFields() {
        document.querySelector("#title").value = ""
        document.querySelector("#author").value = ""
        document.querySelector("#isbn").value = ""
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove()
        }
    }
}

//Storage Class
class Store {
    static getBooks() {
        let books
        if (localStorage.getItem("books") === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("books"))
        }
        return books
    }
    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem("books", JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })
        localStorage.setItem("books", JSON.stringify(books))
    }
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks)

//Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    //Prevent actual submit
    e.preventDefault()

    //Get from values
    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const isbn = document.querySelector("#isbn").value

    //Validate book
    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Please fill in all the fields", "danger");
    } else {
        //Instatiate book
        const book = new Book(title, author, isbn)
        console.log(book)

        //Add book to UI List
        UI.AddBookToList(book)

        //Add book to storage
        Store.addBook(book)

        //Show success message
        UI.showAlert("Book added", "success")

        //Clear fields
        UI.clearFields();


    }

})

//Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target)

    //Book removed message
    UI.showAlert("Book removed", "info")

    //Remove from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})