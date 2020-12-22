# My Angular SQL Blog Application

     Step one, create the main folder called 11. my-angular-sql-blog, then open the folder with vsc.

     Once inside the project using vsc, create a new folder called backend

     change into the backend directory and run npm init to create the package.json file.

     the run the following commands. 
     npm install --save bcryptjs cors express sequelize@4.43.0 mysql2 jsonwebtoken morgan dotenv cookie-parser or install them individually.
     npm install --save bcryptjs
     npm install --save cors
     npm install --save express 
     npm install --save sequelize@4.43.0
     npm install --save mysql2
     npm install --save jsonwebtoken
     npm install --save morgan
     npm install --save dotenv
     npm install --save cookie-parser

     once those are installed run sequelize init and set up the config.json file.  Create an app.js file and link it to the mysql database as well as including the models and necessary imports.  

# App.js file
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models'); //<--- Add this line

var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/user.routes');
var blogsRouter = require('./routes/blog.routes');

const app = express()

.use(logger('dev'))
.use(express.json())
.use(express.urlencoded({ extended: false }))
.use(cookieParser())
.use(express.static(path.join(__dirname, 'public')))

.use('/', indexRouter)
.use('/users', usersRouter)
.use('/blogs', blogsRouter)


const port = process.env.PORT || 4000;

//const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;     
const server =  app.listen(port, function() {
            console.log(`Server listening on the port::${port}`);
        });
// Add this code above the module.exports
models.sequelize.sync().then(function () {
  console.log("Database successfully connected & Sync'd up")
});

module.exports = app;

# Generate the models
sequelize model:generate --name users --attributes user_id:integer,first_name etc..
sequelize model:generate --name blogs --attributes blog_id:integer, title:string etc. 
Finally modify the start script inside the package.json file as follows. 

# Package.json file
"main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js",
    "dev": "nodemon app.js",
    "prod": "node app.js"
  },

  # Error handling in the app.js file
.use(function(req, res, next) {
          next(createError(404))
})
//Error handler
.use(function(error, req, res, next) {
//Set locals, only providing error in development
          res.locals.message = error.message;
          res.locals.error = req.app.get('env') === 'development' ? error: {};
//Render the error page
res.status(error.status || 500)
res.render('error')
})

# Create the dev branch
git branch dev
git checkout dev
git add .
git commit -m " "
git push -u origin dev

  