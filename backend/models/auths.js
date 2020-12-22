'use strict';
module.exports = (sequelize, DataTypes) => {
  const auth = sequelize.define('auth', 
  {
    user_email: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    user_password: {
      type: DataTypes.STRING,
      required: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {});
  auth.associate = function(models) {
  };
  return auth;
};