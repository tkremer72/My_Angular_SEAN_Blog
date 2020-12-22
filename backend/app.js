var createError = require('http-errors');
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models'); //Bring the models into the application

//Do not need the index router, not using this for any serving
//var indexRouter = require('./routes/index.routes');
var adminRouter = require('./routes/admin.routes');
var authRouter = require('./routes/auth.routes');
var userRouter = require('./routes/user.routes');
var blogsRouter = require('./routes/blog.routes');

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS'
    );
 next();
})
.use(cors()) //Bring in the Cross Origin Resources Service
.use(logger('dev'))//Use the logger during development
.use(express.json())
.use(express.urlencoded({ extended: false }))
.use(cookieParser())//Parse the requests as json

//will need to create the backend directory to grant acess for now it is set to public
.use('/', express.static(path.join(__dirname, 'angular-sean-frontend')))

//.use('/', indexRouter)
.use('/admins', adminRouter)
.use('/auths', authRouter)
.use('/users', userRouter)
.use('/blogs', blogsRouter)

//Will need to uncomment and modify code below for production
.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular-sean-frontend", "index.html"))
})

// .use(function(req, res, next) {
//   next(createError(404))
// })

// //Error handler
// .use(function(error, req, res, next) {
// //Set locals, only providing error in development
//   res.locals.message = error.message;
//   res.locals.error = req.app.get('env') === 'development' ? error: {};
// //Render the error page
// res.status(error.status || 500)
// res.render('error')
// })

//Set the environment port number
const port = process.env.PORT || 4000;
//another way to set the environment port number, used with ec2
//const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;     

const server =  app.listen(port, function() {
            console.log(`Server listening on the port::${port}`);
        });

// Add this code above the module.exports
models.sequelize.sync().then(function () {
  database:"process.env.DB_DATABASE"
  console.log("Database successfully connected & Sync'd up")
});

module.exports = app;