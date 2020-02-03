var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adminGuy9er9er:<password>@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
console.log('should be connected');
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


module.exports = router;
