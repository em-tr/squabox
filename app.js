'use strict';

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./modules/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/assets')));

app.engine('handlebars', handlebars({defaultLayout: 'default', helpers: { ifeq(a, b, opt) {
    return (a === b) ? opt.fn(this) : opt.inverse(this);
}}}));
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'handlebars');

app.use(session({ // Create Session
    secret: 'A52A5E69950D44CEAAFB0199095F7C16',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        clientPromise: db.getMongoClient(app), dbName: 'cms', // connectDB, Store Session in DB
        ttl: 7 * 24 * 60 * 60 // Store 7 Days
    })
}));

const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.json('404 not found');
});
