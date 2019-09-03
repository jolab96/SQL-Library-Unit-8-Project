// requiring express, express router, and book model

const express = require('express');
const router = express.Router();
const Books = require('../models/Book');


// Getting the book list

router.get('/', (req, res) => {
    Books.findAll() 
        .then(books => {
            res.render('index', { books: books });
        })
        .catch(err => console.log(err))
});

// Getting the Create New Book form

router.get('/new', (req, res) => res.render('new-book'));

// post method for creating new book and passing properties

router.post('/new', (req, res) => {
    let { title, author, genre, year } = req.body;
    Books.create({
        title,
        author,
        genre,
        year
    })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                res.render('new-book', { err: err.errors });
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});

// Post request to delete selected book by "ID"

router.post('/:id/delete', (req, res) => {
    Books.findByPk(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.destroy();
            } else {
                res.render('error');
            }
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
});


// Getting specific book ID params

router.get('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(book => {
            res.render('update-book', { book });
        })
        .catch(err => console.log(err))
});

// Post request to update specific book

router.post('/:id', (req, res) => {
    Books.findByPk(req.params.id)
        .then(Book => {
            if (Book) {
                return Book.update(req.body);
            } else {
                res.render('error');
            }
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                let book = Books.build(req.body);
                book.dataValues.id = req.params.id;
                console.log(book)
                res.render('update-book', { book, err: err.errors });
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});


module.exports = router;
