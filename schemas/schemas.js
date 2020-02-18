'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;

const moment = require('moment');
moment.locale('de');


// * ####Types:
// * (from mongoose.Schema documentation)
// * - [String](#schema-string-js)
// * - [Number](#schema-number-js)
// * - [Boolean](#schema-boolean-js) | Bool
// * - [Array](#schema-array-js)
// * - [Buffer](#schema-buffer-js)
// * - [Date](#schema-date-js)
// * - [ObjectId](#schema-objectid-js) | Oid
// * - [Mixed](#schema-mixed-js)

const user = new Schema({
    id: Number,
    username: String,
    password: String
});

const layout = new Schema({
    owner: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rows: {
        type: Number,
        required: true
    },
    columns: {
        type: Array,
        required: true
    },
    creationDate: {
        type: String,
        default: moment()
            .format('D. MMMM YYYY, HH:mm [Uhr]')
    },
    gridLayout: {
        type: String
    }
});

const page = new Schema({
    owner: {
        type: ObjectId,
        required: true
    },
    ownerName: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    layout: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    description: {
        type: String
    },
    keywords: {
        type: Array
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    lastEdited: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: String
    }
});

module.exports = {
    User: mongoose.model('User', user),
    Page: mongoose.model('Page', page),
    Layout: mongoose.model('Layout', layout)
};
