'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    'Blog', 
  {
    title: {
      type: DataTypes.STRING,
      required: true
    },
    description: {
      type: DataTypes.TEXT,
      required: true
    },
    date: {
      type: DataTypes.DATE,
      required: true
    },
    author: {
      type: DataTypes.STRING,
      required: true
    },
    /* creator: {
      type: DataTypes.INTEGER,
      
    }, */
    is_deleted: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      foreignKey: true
    }
  }, {});
  Blog.associate = function(models) {
    //Blog.belongsTo(models.users, {foreignKey: 'user_id'});
  };
  return Blog;
};