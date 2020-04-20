const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const cors = require('cors')
const app = express();

const pass = process.env.PASSWORD
const user = process.env.USERNAME
const dbpass = process.env.DBPASS

app.use(cors());

mongoose.connect('mongodb+srv://' + dbpass + ':AtlasShrugged@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority', {
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
const weeklyListModel = mongoose.model('weeklies', repeatableListSchema)
const monthlyListModel = mongoose.model('monthly', repeatableListSchema)


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
app.post('/validateLogin', (req, res) => {  //Validate User Login
  if(user === req.body.username && pass === req.body.password) {
    res.json(true);
  } else {
    res.json(false);
  }
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

app.post('/getRepeatableList', (req, res) => { //ROUTE TO GET REPEATABLE LIST FROM DB
  console.log(req.body.listToGet)
  if(req.body.listToGet === "daily") {
    dailyListModel.find({ })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(error => {
      console.log('error: ', error);
    });
  } else if(req.body.listToGet === "weekly") {
    weeklyListModel.find({ })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(error => {
      console.log('error: ', error);
    });
  } else if(req.body.listToGet === "monthly") {
    monthlyListModel.find({ })
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch(error => {
      console.log('error: ', error);
    });
  }
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
  console.log(req.body.listToUpdate)
  if(req.body.listToUpdate == "daily") {
    console.log('parking daily item complete')
    dailyListModel.findByIdAndUpdate({ _id: req.body.editThis }, { complete: true }).exec(() => {
      dailyListModel.find({ }).exec((err, data) => {
        res.json(data);
      })
    })
  } else if (req.body.listToUpdate == "weekly") {
    weeklyListModel.findByIdAndUpdate({ _id: req.body.editThis }, { complete: true }).exec(() => {
      weeklyListModel.find({ }).exec((err, data) => {
        res.json(data);
      })
    })
  } else if (req.body.listToUpdate == "monthly") {
    monthlyListModel.findByIdAndUpdate({ _id: req.body.editThis }, { complete: true }).exec(() => {
      monthlyListModel.find({ }).exec((err, data) => {
        res.json(data);
      })
    })
  }
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



//Unused Routs to add to daily or weekly repeatable lists

// app.get('/addNewWeekly', function(req, res) {  //ROUTE TO ADD NEW ITEM TO DAILY TODO
//   const newToDoItem = new weeklyListModel({ task: 'vacuum', complete: false });
//   newToDoItem.save((error) => {
//     if(error) {
//       console.log('error');
//     } else {
//       console.log('saved data!');
//     }
//   })
//   res.sendStatus(200);
// })

// app.post('/addNewDaily', function(req, res) {  //ROUTE TO ADD NEW ITEM TO DAILY TODO
//   const newToDoItem = new dailyToDoListModel({ task: req.body.task, complete: req.body.complete });
//   newToDoItem.save((error) => {
//     if(error) {
//       console.log('error');
//     } else {
//       console.log('saved data!');
//     }
//   })
//   res.sendStatus(200);
// })

// app.get('/addNewMonthly', function(req, res) {  //ROUTE TO ADD NEW ITEM TO DAILY TODO
//   const newToDoItem = new monthlyListModel({ task: req.body.task, complete: req.body.complete });
//   newToDoItem.save((error) => {
//     if(error) {
//       console.log('error');
//     } else {
//       console.log('saved data!');
//     }
//   })
//   res.sendStatus(200);
// })
