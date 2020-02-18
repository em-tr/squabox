'use strict';

const db = require('../modules/db');
const assert = require('assert');
const {Page} = require('../schemas/schemas');
const {Layout} = require('../schemas/schemas');
const ObjectId = require('mongodb').ObjectID;

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

module.exports = {
    getPages: (req, res) => {
        db.getDB()
            .collection('pages')
            .find({owner: db.getPrimaryKey(req.session.user._id)})
            .toArray()
            .then(value => res.render('admin/pages/pagesList', {
                username: req.session.user.username,
                pages: value
            }));
        console.log(req.body.pages);
    },
    findLayout: (req, res) => {
        db.getDB()
            .collection('layouts')
            .find({owner: db.getPrimaryKey(req.session.user._id), name: req.body.layout})
            .toArray()
            .then(value => res.send(value));
    },
    editPage: (req, res) => {
        db.getDB()
            .collection('pages')
            .find({_id: db.getPrimaryKey(req.params.id)})
            .toArray()
            .then(value => res.render('admin/pages/edit', {page: value[0]}));
    },
    updatePage: (req, res) => {
        let keywords = [];
        console.log(req.body.form);
        if (req.body.form.keywords) {
            keywords = req.body.form.keywords.toUpperCase().split(' ');
        }
        const pageUpdated = {
            title: req.body.form.title,
            layout: req.body.form.layout,
            status: req.body.form.status,
            description: req.body.form.description,
            keywords,
            content: req.body.content
        };
        db.getDB()
            .collection('pages')
            .updateOne(
                {_id: db.getPrimaryKey(req.params.id)},
                {$set: pageUpdated}, (err, result) => {
                    assert.equal(null, err);
                    res.redirect('/admin/pages');
                },
                {overwrite: true}
            );
    },
    addPage: (req, res) => {
        db.getDB()
            .collection('layouts')
            .find({owner: db.getPrimaryKey(req.session.user._id)})
            .toArray()
            .then(layouts => res.render('admin/pages/addPage', {Layouts: layouts}));
    },
    submitPage: (req, res) => {
        let keywords = [];
        if (req.body.form.keywords) {
            keywords = req.body.form.keywords.toUpperCase()
                .split(' ');
        }
        const newPage = new Page({
            owner: db.getPrimaryKey(req.session.user._id),
            ownerName: req.session.user.username,
            title: req.body.form.title,
            layout: req.body.form.layout,
            status: req.body.form.status,
            description: req.body.form.description,
            keywords,
            content: req.body.content
        });
        db.getDB()
            .collection('pages')
            .insertOne(newPage, (err, result) => {
                assert.equal(null, err);
                res.redirect('/admin/pages');
            });
    },
    deletePage: (req, res) => {
        db.getDB()
            .collection('pages')
            .deleteOne({_id: db.getPrimaryKey(req.params.id)}, (err, result) => {
                assert.equal(null, err);
                console.log('Deleted successfully');
                res.redirect('/admin/pages');
            });
    },
    /*
    * Layout Routes
    * */
    getCreateLayout: (req, res) => res.render('admin/userLayouts/createLayout', {
        title: 'Create Layout'
    }),
    createLayout: (req, res) => {
        const newLayout = new Layout({
            owner: db.getPrimaryKey(req.session.user._id),
            name: req.body.layoutName,
            rows: req.body.rows,
            columns: req.body.columns,
            gridLayout: req.body.gridLayout
        });
        db.getDB()
            .collection('layouts')
            .insertOne(newLayout, (err, layout) => {
                assert.equal(null, err);
                res.json({
                    id: layout.insertedId,
                    owner: db.getPrimaryKey(req.session.user._id),
                    name: req.body.layoutName,
                    rows: req.body.rows,
                    columns: req.body.columns,
                    gridLayout: req.body.gridLayout
                });
                console.log(`inserted new layout: ${newLayout}`);
            });
    },
    allLayouts: (req, res) => {
        db.getDB()
            .collection('layouts')
            .find({owner: db.getPrimaryKey(req.session.user._id)})
            .toArray((err, layouts) => {
                if (err) {
                    res.send('Could not get Layouts from database');
                } else {
                    res.render('admin/userLayouts/allLayouts', {
                        layouts
                    });
                }
            });
    },
    deleteLayout: (req, res) => {
        const id = ObjectId(req.params.id);
        db.getDB()
            .collection('layouts')
            .deleteOne({_id: id}, (err) => {
                if (err) {
                    return res.status(501)
                        .json({
                            message: 'Not able to delete layout'
                        });
                }
                return res.json({id});
            });
    },
    editLayout: (req, res) => {
        db.getDB().collection('layouts').find({_id: db.getPrimaryKey(req.params.id)})
            .toArray((err, layouts) => {
                if (err) {
                    res.send('Could not get Layout from database');
                } else {
                    res.render('admin/userLayouts/editLayout', {
                        layouts,
                        title: 'Edit'});
                }
            });
    },
    saveGridLayout: (req, res) => {
        const id = ObjectId(req.body.id);
        let {gridLayout} = req.body;
        gridLayout = entities.encode(gridLayout);
        db.getDB()
            .collection('layouts')
            .updateOne({_id: id}, {$set: {gridLayout}}, (err, layout) => {
                if (err) {
                    return res.status(501)
                        .json({
                            message: 'Not able to update gridLayout'
                        });
                }
                console.log(`successfully updated gridLayout: ${gridLayout}`);
                return res.json({
                    id,
                    gridLayout
                });
            });
    },
    loadLayout: (req, res, cb) => {
        const id = ObjectId(req.body.id);
        db.getDB()
            .collection('layouts')
            .find({_id: id})
            .toArray((err, layout) => {
                if (err) {
                    return res.status(501)
                        .json({
                            message: 'Not able to load layout'
                        });
                }
                JSON.stringify(layout);
                let {gridLayout} = layout[0];
                gridLayout = entities.decode(gridLayout);
                console.log(`sucessfully loaded gridLayout: ${gridLayout}`);
                res.json({
                    gridLayout
                });
            });
    }
};
