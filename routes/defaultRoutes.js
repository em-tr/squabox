'use strict';

const express = require('express');
const controller = require('../controllers/defaultController');

const router = express.Router();
// const auth = require('../modules/auth');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';
    next();
});

router.route('/')
    .get(controller.dashboard);
router.route('/login')
    .get(controller.loginGet)
    .post(controller.loginPost);
router.route('/register')
    .get(controller.registerGet)
    .post(controller.registerPost);
router.route('/pages/:id')
    .get(controller.showPage);

module.exports = router;
