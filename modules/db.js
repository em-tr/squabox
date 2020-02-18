'use strict';

const {MongoClient} = require('mongodb');
const {ObjectID} = require('mongodb');


const {databaseName, databaseUrl} = require('../config/config');

const state = { db: null, dbClient: MongoClient };


const connect = (callback) => {
    if (state.db) {
        callback();
    } else {
        MongoClient.connect(databaseUrl, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, (err, client) => {
            if (err) {
                callback(err);
            } else {
                state.dbClient = client;
                state.db = client.db(databaseName);
                callback();
            }
        });
    }
};

// mongoDB is strongly typed therefore it needs to be an ObjectID not String!
const getPrimaryKey = _id => ObjectID(_id);

const getDB = () => state.db;


function getMongoClient(app) {
    return new Promise((resolve, reject) => {
        connect((err) => {
            if (err) {
                console.log('Unable to connect to database');
                reject(err);
            } else {
                app.listen(3000, () => console.log('connected to database, app listening on port 3000'));
                resolve(state.dbClient); // Return MongoClient
            }
        });
    });
}

module.exports = {getDB, connect, getPrimaryKey, getMongoClient};
