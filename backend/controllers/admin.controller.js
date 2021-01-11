var models = require('../models');
var credentialService = require('../services/authorize');

//Get a user for the  update user form
exports.get_user = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then((user) => {
                         if (user) {
                              models.User.findByPk(parseInt(req.params.id))
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
     } catch (err) {
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
                              models.User.findAll({
                                   where: { is_deleted: false }
                              }).then((users) => {
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

exports.delete_user = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              let userId = req.params.id;
                              models.Blog.update(
                                   { is_deleted: true },
                                   { where: { user_id: userId } }
                              )
                                   .then(models.User.update(
                                        { is_deleted: true },
                                        { where: { id: userId } }
                                   ))
                                   .then(models.Auth.update(
                                        { is_deleted: true },
                                        { where: { id: userId } }
                                   ))
                                   .then(result => {
                                        res.status(200).json({
                                             message: 'Successfully removed user and users information.'
                                        })
                                   })
                         } else {
                              res.status(400).json({ message: 'Could not complete your request, please make sure you are logged in and try again.' })
                         }
                    })
          } else {
               return res.status(401).json({
                    message: 'You are not authorized, please log in and try again later.'
               })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Whoops, something went wrong, please try again later!'
          });
     }
}

