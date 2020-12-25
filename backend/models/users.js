'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users', 
    {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      required: true
    },
    last_name: {
      type: DataTypes.STRING,
      required: true
    },
    user_name: {
      type: DataTypes.STRING,
      required: false
    },
    user_email: {
      type: DataTypes.STRING,
      required: false,
      unique: true
    },
    user_address: {
      type: DataTypes.STRING,
      required: true
    },
    user_city: {
      type: DataTypes.STRING,
      required: true
    },
    user_state: {
      type: DataTypes.STRING,
      required: true
    },
    user_zip: {
      type: DataTypes.STRING,
      required: true
    },
    user_phone: {
      type: DataTypes.STRING,
      required: true
    },
    user_mobile: {
      type: DataTypes.STRING,
      required: false
    },
    imagePath: {
      type: DataTypes.STRING,
      required: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {});
  users.associate = function(models) {
    users.hasMany(models.blogs, {foreignKey: 'user_id'});
  };
  return users;
};