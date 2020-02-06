var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

var cors=require('cors');

app.use(cors({origin:true,credentials: true}));
// app.use(bodyParser.json()); // <--- Here
// app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb+srv://adminGuy9er9er:AtlasShrugged@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('connected to DB!!!');
})

//Schema 
const Schema = mongoose.Schema;
const toDo = new Schema({
  title:String
});

//Model
const BlogPost = mongoose.model('toDoList', toDo)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//Custom Routes
app.get('/getData', (req, res) => { //ROUTE TO GET INITIAL LIST FROM DB
  BlogPost.find({ })
    .then((data) => {
      // console.log('Data: ', data);
      res.json(data);
    })
    .catch((error) => {
      // console.log('error: ', error);
    });
})

app.post('/addNew', function(req, res) {  //ROUTE TO ADD NEW ITEM
    console.log('recieved post');
    console.log(req.body.title);

    let data = {
      title: req.body.title
    }
    
    const newToDoItem = new BlogPost(data);
    
    newToDoItem.save((error) => {
      if(error) {
        console.log('error');
      } else {
        console.log('saved data!');
      }
    })

    res.sendStatus(200);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
