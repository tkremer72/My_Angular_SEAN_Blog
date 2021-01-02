var models = require('../models');
var credentialService = require('../services/authorize');


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
          let userId = parseInt(req.params.id);
          if(token) {
               credentialService.confirmIdentity(token)
               .then(user => {
                    if(user) {
                         models.auth.destroy({
                              where: { id: userId }
                         }).then(models.users.destroy({
                              where: { id: userId }
                         })).then(models.blogs.destroy({
                              where: { user_id: userId}
                         })).then(result => {
                              res.status(200).json({
                                   message: 'Successfully removed user and users information.'
                              })
                         })
                    } else {
                         res.status(400).json({message: 'Could not complete your request, please make sure you are logged in and try again.'})
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

