const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

const cors=require('cors');
app.use(cors({origin:true,credentials: true}));

mongoose.connect('mongodb+srv://adminGuy9er9er:AtlasShrugged@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {})

//Schema 
const Schema = mongoose.Schema;

const toDoListSchema = new Schema({
  task:String
});

const repeatableListSchema = new Schema({
  task:String,
  complete:Boolean
});

//Models
const toDoListModel = mongoose.model('toDoList', toDoListSchema)
const dailyListModel = mongoose.model('dailytodo', repeatableListSchema)
const weeklyListModel = mongoose.model('weeklytodo', repeatableListSchema)


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
app.post('/validateLogin', function(req, res) {  //Validate User Login
  if("ghughes13" === req.body.username && "testPassword1" === req.body.password) {
    res.json(true);
  }
  res.json(false);
})

app.get('/getToDoList', (req, res) => { //ROUTE TO GET INITIAL LIST FROM DB
  toDoListModel.find({ })
  .exec()
  .then((data) => {
    res.json(data);
  })
  .catch(error => {
    console.log('error: ', error);
  });
})

app.get('/getRepeatableList', (req, res) => { //ROUTE TO GET INITIAL LIST FROM DB
  if(req.body.listToUpdate == "daily") {
    dailyListModel.find({ })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(error => {
      console.log('error: ', error);
    });
  } else if(req.body.listToUpdate == "weekly") {
    weeklyListModel.find({ })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(error => {
      console.log('error: ', error);
    });
  }
})



app.post('/addNewDaily', function(req, res) {  //ROUTE TO ADD NEW ITEM TO DAILY TODO
  const newToDoItem = new dailyToDoListModel({ task: req.body.task, complete: req.body.complete });
  newToDoItem.save((error) => {
    if(error) {
      console.log('error');
    } else {
      console.log('saved data!');
    }
  })
  res.sendStatus(200);
})

app.post('/addNew', function(req, res) {  //ROUTE TO ADD NEW ITEM
    const newToDoItem = new toDoListModel({ task: req.body.task });
    newToDoItem.save((error) => {
      if(error) {
        console.log('error');
      } else {
        console.log('saved data!');
      }
    })
    res.sendStatus(200);
})



app.delete('/delItem', function(req, res) {
  toDoListModel.findByIdAndDelete((req.body.delThis)).exec(() => {
    toDoListModel.find({ }).exec((err, data) => {
      res.json(data);
    });
  })
})



app.put('/updateItem', function(req, res) {
  toDoListModel.findByIdAndUpdate(req.body.editThis, { task: req.body.newText }).exec(() => {
    toDoListModel.find({ }).exec((err, data) => {
      res.json(data);
    })
  })
})

app.put('/markItemComplete', function(req, res) {
  // if(req.body.listToUpdate == "daily") {
    dailyListModel.findByIdAndUpdate({ _id: req.body.editThis }, { complete: true }).exec(() => {
      dailyListModel.find({ }).exec((err, data) => {
        res.json(data);
      })
    })
  // } else if (req.body.listToUpdate == "weekly" {

  // }
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
