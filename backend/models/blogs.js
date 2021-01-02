'use strict';
module.exports = (sequelize, DataTypes) => {
  const blogs = sequelize.define('blogs', 
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
  blogs.associate = function(models) {
    //blogs.belongsTo(models.users, {foreignKey: 'user_id'});
  };
  return blogs;
};