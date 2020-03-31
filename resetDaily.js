const express = require('express');
const mongoose = require('mongoose');

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

mongoose.connection.on('connected', () => {})

//Schema 
const Schema = mongoose.Schema;

const repeatableListSchema = new Schema({
  task:String,
  complete:Boolean
});

//Models
const dailyListModel = mongoose.model('dailytodo', repeatableListSchema)
const weeklyListModel = mongoose.model('weeklytodo', repeatableListSchema)

dailyListModel.find({ }).exec((err, data) => {
  data.forEach(item => {
    dailyListModel.findByIdAndUpdate({ _id: item.id }, { complete: false }).exec();
  })
})


