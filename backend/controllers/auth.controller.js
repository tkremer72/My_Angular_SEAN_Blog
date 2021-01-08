var models = require('../models');
const { validationResult } = require('express-validator');
var credentialService = require('../services/authorize');




//Create a new user if one does not exist
exports.user_signup = async function (req, res, next) {
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
          // return res.status(400).json({ errors: errors.message })
          next(new HttpError('Invalid inputs passed, please check your data!', 422))
     }
     try {
          await models.User.findOrCreate({
               where: { user_email: req.body.user_email },
               defaults: {
                    first_name: '',
                    last_name: '',
                    user_name: '',
                    user_address: '',
                    user_state: '',
                    user_city: '',
                    user_zip: 00000,
                    user_phone: '(919)999-9999',
                    user_mobile: '(919)999-9999',
                    is_deleted: false
               }
          }).then(await models.Auth.findOrCreate({
               where: { user_email: req.body.user_email },
               defaults: {
                    user_password: credentialService.lockPassword(req.body.user_password),
                    is_admin: false,
                    is_deleted: false
               }
          })).spread(function (result, created) {
               if (created) {
                   // console.log(result);
                    res.status(201).json({
                         message: 'User was created.'
                    });
               } else {
                    return res.status(400).json({
                         message: 'Could not create user, please try again later.'
                    })
               }
          })
     } catch (err) {
        return res.status(500).json({
             message: 'Whoops, something went wrong, please try again later!'
        });
     }
}
//Log a user in
exports.user_login = async function(req, res, next) {
     try {
          let fetchedUser;
         await models.Auth.findOne({
              where: { user_email: req.body.user_email }
         }).then(user => {
              if(!user) {
                   return res.status(404).json({
                        message: 'Could not find user, please check your information and try again!'
                   })
              } else {
                   fetchedUser = user;
                   let passwordMatch = credentialService.unlockPassword(req.body.user_password, user.user_password);
                   if(passwordMatch) {
                        let token = credentialService.issueToken(user);
                        res.status(202).json({
                             token: token,
                             message: 'You have been logged in!',
                             expiresIn: 3600,
                             userId: fetchedUser.id,
                             is_admin: fetchedUser.is_admin
                        })
                   } else {
                        return res.status(401).json({
                             message: 'You are not authorized, please check your credentials and try again.'
                        });
                   }
              } 
         })
     } catch(err) {
          return res.status(500).json({
               message: "Could not complete your request at this time, please try again later."
          })
     }
}

