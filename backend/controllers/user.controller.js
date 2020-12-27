var models = require('../models');
var credentialService = require('../services/authorize');

//Get a users profile using the token
exports.get_profile =  async function(req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
            credentialService.confirmIdentity(token).then((user) => {
              if (user) {
                res.status(200).json(user);
              } else {
                return res.status(401).json({
                     message: 'Invalid credentials, you are not authorized.  Please log in and try again.'
                });
              }
            });
          } else {
            return res.status(401).json({
                 message: 'You are not authorized.  Please log in and try again later.'
            });
          }
     } catch(err) {
          return res.status(500).json({
               message: 'Internal server error, please log in and try again later.'
          })
     }
   }

//Get a user for the  update user form
exports.get_user = async function(req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
            credentialService.confirmIdentity(token)
            .then((user) => {
              if (user) {
                models.users.findByPk(parseInt(req.params.id))
                .then(user => {
                  res.status(200).json(user);
                });
              } else {
                res.status(401).json({
                     message: 'Invalid credentials, you are not authorized. Please log in and try again.'
                });
              }
            });
          } else {
            res.status(401).json({
                 message: 'You are not authorized, please try again later.'
            });
          }
     } catch(err) {
          return res.status(500).json({
               message: 'Internal server error, something went wrong.  Please try again later.'
          })
     }
   }

//Get all of the users in the database. 
exports.get_users = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              models.users.findAll({
                                   where: { is_deleted: false }
                              }).then((users, error) => {
                                   if (users) {
                                        //console.log(users);
                                        res.status(200).json({
                                             message: "Users have been fetched!",
                                             users
                                        })
                                   } else {
                                        res.status(404).json({
                                             message: 'Could not find any users.'
                                        })
                                   }
                              })
                         } else {
                              return res.status(401).json({
                                   message: 'You are not authorized, please log in and try again!'
                              })
                         }
                    })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Whoops, something went wrong, please try again later!'
          });
     }
}
//Update the users information
exports.update_user = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          let user_id = parseInt(req.params.id);
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              const url = req.protocol + '://' + req.get('host');
                              imagePath = url + '/images/' + req.file.filename;
                              models.users.update({
                                   imagePath: imagePath,
                                   first_name: req.body.first_name,
                                   last_name: req.body.last_name,
                                   user_name: req.body.user_name,
                                   user_address: req.body.user_address,
                                   user_city: req.body.user_city,
                                   user_state: req.body.user_state,
                                   user_zip: req.body.user_zip,
                                   user_phone: req.body.user_phone,
                                   user_mobile: req.body.user_mobile,
                                   is_admin: false,
                                   is_deleted: false
                              }, {
                                   where: { id: user_id }
                              }
                              ).then(models.auth.update({
                                   user_email: req.body.user_email,
                              }, {
                                   where: { user_email: req.body.user_email }
                              })).then(function (result) {
                                   if (result) {
                                        res.status(200).json({
                                             message: 'User information has been updated!'
                                        })
                                   } else {
                                        res.status(404).json({
                                             message: 'Could not find any users matching that id.'
                                        })
                                   }
                              })
                         } else {
                              res.status(401).json({
                                   message: 'Invalid credentials, please log in and try again.'
                              })
                         }
                    })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Something went wrong, internal server error. Please try again later.'
          })
     }
}