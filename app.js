const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const Config = require('./config/config');

// Setting the views folder, 

app.set('views', path.join(__dirname, 'views'));

// setting the , VIEW ENGINE AS PUG

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, 'public')));

// Redirecting home route to "/books"

app.get('/', (req, res) => res.redirect('/books'));

// letting /books require the books route

app.use('/books', require('./Routes/books'));

// rendering a 404 error page

app.use((request, response, next) => {
    const err = new Error("error");
    err.status = 404;
    next(err)
    response.render('page-not-found')
    console.log(err);
});

app.use((err, request, response, next) => {
    response.locals.error = err
    response.status(err.status)
});

Config.sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'))
    })