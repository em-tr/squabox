'use strict';
if(process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config();
}

module.exports = {
    databaseName: 'cms',
    databaseUrl: process.env.DATABASE_URL
};