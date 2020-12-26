var models = require('../models');
var credentialService = require('../services/authorize');

//create a new blog if one does not exist
exports.create_blog = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              models.blogs.findOrCreate({
                                   where: { title: req.body.title },
                                   defaults: {
                                        title: req.body.title,
                                        description: req.body.description,
                                        date: req.body.date,
                                        author: req.body.author,
                                        is_deleted: false,
                                        user_id: user.id
                                   }
                              }).spread(function (result,created) {
                                   if (created) {
                                        res.status(201).json(created)
                                   } else {
                                        res.status(400).json({
                                             message: 'Could not validate your credentials, please log in and try again.'
                                        })
                                   }
                              })
                         }
                    })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Something went wrong, internal server error. Please try again later!'
          })
     }
}
//Get a blog for the details of that blog
exports.get_blog = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          let blog_id = parseInt(req.params.id);
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              models.blogs.findById(req.params.id)
                                   .then(blog => {
                                        res.status(200).json(blog)
                                   })
                         } else {
                              res.status(404).json({
                                   message: 'We could not find any blogs with that id.'
                              })
                         }
                    })
          } else {
               return res.status(401).json({
                    message: 'You are not authenticated, please log in and try again.'
               })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Something went wrong, internal server error!'
          })
     }
}
//Get all of the blogs in the database
exports.get_all_blogs = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {  
                              let fetchedBlogs;
                             /*  const pageSize = +req.query.pagesize;
                              const currentPage = +req.query.page;
                              const paginate = (query, { currentPage, pageSize }) => {
                                   const offset = (pageSize * (currentPage - 1));
                                   const limit = pageSize;
                                   return {
                                        ...query,
                                        offset,
                                        limit
                                   }
                              } */
                              models.blogs.findAll(
                                   /* paginate(
                                        {
                                             where: { is_deleted: false },
                                        },
                                        { currentPage, pageSize }
                                   ) */
                              ) .then(documents => {
                              fetchedBlogs = documents;
/*                               console.log(documents);
 */                              //models.users.countDocuments();
                         }).then(count => {
                              res.status(200).json({
                                   message: "Blogs fetched successfully.",
                                   blogs: fetchedBlogs,
                                   maxBlogs: count
                              });
                         })/* .catch(error => {
                              res.status(500).json({
                                   message: 'Cound not fetch blogs, please try again later.'
                              })
                         }) */
                         } 
                    })
          } else {
               return res.status(401).json({
                    message: 'You are not authenticated, please login and try again.'
               })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Internal server error, please try again later.'
          })
     }
}
//Get all of the blogs by a single user
exports.get_users_blogs = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         let user_id = parseInt(req.params.id);
                         if (user) {
                              models.blogs.findAll({
                                   where: { id: user_id, is_deleted: false }
                              }).then(blogs => {
                                   if (blogs) {
                                        res.status(200).json(blogs)
                                   } else {
                                        return res.status(404).json({
                                             message: 'We could not find any blogs by you, please create one.'
                                        })
                                   }
                              })
                         }
                    })
          } else {
               return res.status(401).json({
                    message: 'You are not authenticated, please log in and try again.'
               })
          }
     } catch (err) {
          return res.status(500).json({
               message: 'Internal server error, please try again later.'
          })
     }
}
//Update an existing blog in the database
exports.update_blog = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              let blogId = parseInt(req.params.id);
                              models.blogs.update({
                                   title: req.body.title,
                                   description: req.body.description,
                                   author: req.body.author,
                                   date: req.body.date,
                                   is_deleted: false
                              }, {
                                   where: {
                                        id: req.params.id
                                   }
                              }).then(function (result, error) {
                                   if (result) {
                                        res.status(202).json({
                                             message: 'Blog successfully updated.'
                                        })
                                   } else {
                                        res.status(404).json({
                                             message: 'Could not update blog, id does not exist.'
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
               message: 'Something went wrong, internal server error.  Please try again later. '
          })
     }
}
//Delete a blog from the database
exports.delete_blog = async function (req, res, next) {
     try {
          let token = req.headers['key'];
          let blog_id = parseInt(req.params.id);
          if (token) {
               credentialService.confirmIdentity(token)
                    .then(user => {
                         if (user) {
                              models.blogs.destroy({
                                   where: { id: blog_id }
                              }).then(result => {
                                   if (result) {
                                        res.status(200).json({
                                             message: 'Blog successfully deleted.'
                                        })
                                   } else {
                                        res.status(404).json({
                                             message: 'Could not find any blogs matching that id.'
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
               message: 'Internal server error, please try again later. '
          })
     }
}
