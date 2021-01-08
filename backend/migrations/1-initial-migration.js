'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Auths", deps: []
 * createTable "Blogs", deps: []
 * createTable "Users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "initial-migration",
    "created": "2021-01-02T20:49:09.033Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Auths",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "user_email": {
                    "type": Sequelize.STRING,
                    "field": "user_email",
                    "unique": true,
                    "required": true
                },
                "user_password": {
                    "type": Sequelize.STRING,
                    "field": "user_password",
                    "required": true
                },
                "is_admin": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_admin",
                    "default": false
                },
                "is_deleted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_deleted",
                    "default": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Blogs",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING,
                    "field": "title",
                    "required": true
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "required": true
                },
                "date": {
                    "type": Sequelize.DATE,
                    "field": "date",
                    "required": true
                },
                "author": {
                    "type": Sequelize.STRING,
                    "field": "author",
                    "required": true
                },
                "is_deleted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_deleted",
                    "default": false
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "foreignKey": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true,
                    "allowNull": false
                },
                "first_name": {
                    "type": Sequelize.STRING,
                    "field": "first_name",
                    "required": true
                },
                "last_name": {
                    "type": Sequelize.STRING,
                    "field": "last_name",
                    "required": true
                },
                "user_name": {
                    "type": Sequelize.STRING,
                    "field": "user_name",
                    "required": false
                },
                "user_email": {
                    "type": Sequelize.STRING,
                    "field": "user_email",
                    "unique": true,
                    "required": false
                },
                "user_address": {
                    "type": Sequelize.STRING,
                    "field": "user_address",
                    "required": true
                },
                "user_city": {
                    "type": Sequelize.STRING,
                    "field": "user_city",
                    "required": true
                },
                "user_state": {
                    "type": Sequelize.STRING,
                    "field": "user_state",
                    "required": true
                },
                "user_zip": {
                    "type": Sequelize.STRING,
                    "field": "user_zip",
                    "required": true
                },
                "user_phone": {
                    "type": Sequelize.STRING,
                    "field": "user_phone",
                    "required": true
                },
                "user_mobile": {
                    "type": Sequelize.STRING,
                    "field": "user_mobile",
                    "required": false
                },
                "imagePath": {
                    "type": Sequelize.STRING,
                    "field": "imagePath",
                    "required": false
                },
                "is_deleted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_deleted",
                    "default": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
