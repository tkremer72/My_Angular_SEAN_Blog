'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "users", deps: []
 * createTable "auths", deps: [users]
 * createTable "blogs", deps: [users]
 *
 **/

var info = {
    "revision": 1,
    "name": "migrate",
    "created": "2020-12-22T04:09:14.530Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "users",
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
            "auths",
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
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "blogs",
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
                    "type": Sequelize.STRING,
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
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
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
