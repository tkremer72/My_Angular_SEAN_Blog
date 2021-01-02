const jwt = require('jsonwebtoken');
const models = require('../models');
const bcrypt = require('bcryptjs');

var credentialService = {
  issueToken: function (user) {
    const token = jwt.sign({
      user_email: user.user_email,
      user_name: user.user_name,
      user_id: user.id,
    },
    process.env.TOKEN_KEY, {
      expiresIn: '1h'
    }
    );
    return token;
  },
  confirmIdentity: function (token) { //<--- receive JWT token as parameter
    try {
      let decoded = jwt.verify(token, process.env.TOKEN_KEY);
      let userData = { user_email: decoded.user_email, userId: decoded.user_id }
      //<--- Decrypt token using same key used to encrypt
      //console.log(decoded);
      return models.users.findByPk(decoded.user_id, userData); //<--- Return result of database query as promise
    console.log(decoded.user_id, userData);
    } catch (err) {
      //console.log(err);
      return null;
    }
  },
  lockPassword: function (plainTextPassword) {
    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(plainTextPassword, salt);
    return hash;
  },
  unlockPassword: function (plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword)
  }
}
module.exports = credentialService;