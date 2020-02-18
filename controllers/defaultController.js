'use strict';

const auth = require('../modules/auth');
const db = require('../modules/db');
const assert = require('assert');

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

module.exports = {
    showPage: (req, res, next) => {
        try {
            db.getDB()
                .collection('pages')
                .find({_id: db.getPrimaryKey(req.params.id)})
                .toArray((err, page) => {
                    assert.equal(null, err);
                    console.log(page[0]);
                    res.render('pages/showPage', {content: page[0].content});
                });
        } catch (err) {
            next();
        }
    },
    dashboard: (req, res) => {
        const userExists = typeof req.session.user !== 'undefined';
        db.getDB()
            .collection('pages')
            .find(userExists ? {} : {status: 'public'})
            .toArray()
            .then((pages) => {
                const keywords = [...new Set(flatten(pages.map(p => p.keywords)))];
                res.render('layouts/dashboard', {
                    Title: 'Home',
                    username: userExists ? req.session.user.username : null,
                    pages,
                    keywords
                });
            });
    },
    loginGet: (req, res) => res.render('layouts/login', {
        Title: 'Login'
    }),
    loginPost: (req, res) => {
        const user = {username: req.body.username.toLowerCase(), password: req.body.password};
        if (user) {
            auth.login(res, req, user);
        } else {
            res.end('No User defined');
        }
    },
    logout: (req, res) => auth.logout(req, res),
    registerGet: (req, res) => res.render('layouts/register', {
        Title: 'Register'
    }),
    registerPost: (req, res) => {
        const user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };
        if (user) {
            auth.register(user, res)
                .then(data => res.render('layouts/login', {
                    Title: 'Login',
                    ErrorMsg: 'You can now log in'
                }))
                .catch(err => res.render('layouts/register', {
                    Title: 'Register',
                    ErrorMsg: err
                }));
        } else {
            res.end('No User defined');
        }
    },
    404: (req, res) => res.render('layouts/404', {
        Title: 'Not Found'
    })
};