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
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('connected to DB!!!');
})

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

app.get('/getDailyToDoList', (req, res) => { //ROUTE TO GET INITIAL LIST FROM DB
  dailyListModel.find({ })
  .exec()
  .then((data) => {
    console.log(data);
    res.json(data);
  })
  .catch(error => {
    console.log('error: ', error);
  });
})



app.post('/addNewDaily', function(req, res) {  //ROUTE TO ADD NEW ITEM TO DAILY TODO
  console.log(req.body.task, req.body.complete);
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
      console.log(data);
      res.json(data);
      console.log('sent updated list')
    });
  })
})



app.put('/updateItem', function(req, res) {
  toDoListModel.findByIdAndUpdate(req.body.editThis, { task: req.body.newText }).exec(() => {
    toDoListModel.find({ }).exec((err, data) => {
      console.log(data)
      res.json(data);
      console.log('sent response')
    })
  })
})

app.put('/updateDailyItem', function(req, res) {
  console.log(req.body.editThis)
  dailyListModel.findByIdAndUpdate({ _id: req.body.editThis }, { complete: true }).exec(() => {
    dailyListModel.find({ }).exec((err, data) => {
      res.json(data);
    })
  })
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

var CronJob = require('cron').CronJob;
var job = new CronJob('0 0 0 * * *',
  () => {
    console.log('chroned')
    dailyListModel.find({ }).exec((err, data) => {
      data.forEach(item => {
        dailyListModel.findByIdAndUpdate({ _id: item.id }, { complete: false }).exec();
      })
    })
  },
 ()  => console.log("error"),
 true,
 'America/Chicago',
 {},
 false);
job.start();

module.exports = app;
