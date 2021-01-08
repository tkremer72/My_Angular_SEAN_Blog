'use strict';
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    'Auth', 
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
  Auth.associate = function(models) {
  };
  return Auth;
};