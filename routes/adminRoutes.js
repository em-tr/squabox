'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../modules/auth');

const adminController = require('../controllers/adminController');
const controller = require('../controllers/defaultController');
const defaultController = require('../controllers/defaultController');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});
router.use('/', (req, res, next) => { auth.getSession(req, res, next); });
router.route('/logout')
    .post(controller.logout);

router.route('/').get(defaultController.dashboard);

router.route('/pages')
    .get(adminController.getPages);

router.route('/pages/editPage/:id')
    .get(adminController.editPage)
    .post(adminController.updatePage);

// router.route('/:id').get(adminController.updatePage);

router.route('/pages/addPage')
    .get(adminController.addPage)
    .post(adminController.submitPage);

router.route('/pages/deletePage/:id')
    .get(adminController.deletePage);
router.route('/findLayout')
    .post(adminController.findLayout);
/*
* Layout Routes
* */
router.route('/layout/createLayout')
    .get(adminController.getCreateLayout);
router.route('/layout/createLayout/add')
    .post(adminController.createLayout);
router.route('/layout/createLayout/saveGridLayout')
    .post(adminController.saveGridLayout);
router.route('/layout/createLayout/loadLayout')
    .post(adminController.loadLayout);
router.route('/layout/allLayouts')
    .get(adminController.allLayouts);

router.route('/layout/delete/:id')
    .delete(adminController.deleteLayout);
router.route('/layout/edit/:id')
    .get(adminController.editLayout);


module.exports = router;
