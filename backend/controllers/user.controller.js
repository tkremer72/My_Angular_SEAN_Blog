var models = require('../models');
var credentialService = require('../services/authorize');

//Get a users profile using the token
exports.get_profile =  function(req, res, next) {
     let token = req.headers['key'];
     if (token) {
       credentialService.confirmIdentity(token).then((user, error) => {
         if (user) {
           res.status(200).json(user);
         } else {
           res.status(400).json(error);
         }
       });
     } else {
       res.status(500).json(error);
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
                              models.users.update({
                                   first_name: req.body.first_name,
                                   last_name: req.body.last_name,
                                   user_name: req.body.user_name,
                                   user_password: req.body.user_password,
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
                                   user_password: credentialService.lockPassword(req.body.user_password)
                              }, {
                                   where: { user_email: req.body.user_email }
                              })).then(function (result, error) {
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