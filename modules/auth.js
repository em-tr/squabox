'use strict';

const db = require('./db');
const collection = 'user';
const assert = require('assert');
const bcrypt = require('bcryptjs');

function login(res, req, user) {
    console.log(`got username: ${user.username}, password: ${user.password}`);
    db.getDB()
        .collection(collection)
        .findOne({
            username: user.username
        })
        .then((userFound) => {
            console.log(userFound);
            if (userFound) {
                bcrypt.compare(user.password, userFound.password).then(  // Check Hash of Password
                    (result) => {
                        req.session.regenerate(() => {
                            /* req.session.user = {}; // Store the Session
                            req.session.user.email = userFound.email;
                            // eslint-disable-next-line
                            req.session.user._id = userFound._id;
                            req.session.user.username = userFound.username;*/
                            req.session.user = userFound;
                            req.session.success = `Authenticated as  ${user.username}`;
                            console.log(req.session.user);
                            res.redirect('/admin');
                        });
                    },
                    (err) => {  // Password wrong
                        console.log('Password wrong');
                        req.session.error = 'Authentication failed';
                        res.render('layouts/login', {
                            Title: 'Login',
                            ErrorMsg: 'Username or Password is wrong'
                        });
                    }
                );
            } else { // User not Found
                req.session.error = 'Authentication failed';
                res.render('layouts/login', {
                    Title: 'Login',
                    ErrorMsg: 'Username or Password is wrong'
                });
            }
        });
}

function register(user, res) {
    return new Promise((resolve, reject) => {
        // check if the email already exists (unique key)
        db.getDB()
            .collection(collection)
            .find({ $or: [{ email: user.email }, { username: user.username }] })
            .toArray()
            .then((result) => {
                console.log('User Found:');
                console.log(result);
                // insert new user if the email does not exist
                if (result.length === 0) {
                    bcrypt.hash(user.password, 10, (err, hash) => { // Hash Password
                        if (err) {
                            reject('Hashing Error');
                        }
                        const newUser = {};  //  Create User with Hashed Password
                        newUser.password = hash;
                        newUser.username = user.username.toLowerCase();
                        newUser.email = user.email;
                        db.getDB()
                            .collection(collection)
                            .insertOne(newUser, (err, result) => {  // Inser User in Database
                                assert.equal(null, err);
                                console.log(`User: {${user.username}, ${user.email}, ${user.password}} inserted`);
                                resolve(true);
                            });
                    });
                    // user already exists
                } else {
                    return reject('Email or Username already in use!');
                }
            });
    });
}

function getSession(req, res, next) {
    if (!req.session.user) {
        res.render('layouts/login', {
            Title: 'Login',
            ErrorMsg: 'You are not allowed to access this Page!'
        });
    } else {
        console.log(req.session.user);
        // res.redirect('/home');
        next();
    }
}
function logout(req, res, next) {
    if (req.session.user) {
        req.session.destroy();
        console.log('Session Destroyed');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
}

module.exports = { login, register, getSession, logout};
