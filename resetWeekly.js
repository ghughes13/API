const mongoose = require('mongoose');

try {
  mongoose.connect('mongodb+srv://adminGuy9er9er:AtlasShrugged@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  mongoose.connection.on('connected', () => {})

  //Schema 
  const Schema = mongoose.Schema;

  const repeatableListSchema = new Schema({
    task:String,
    complete:Boolean
  });

  //Models
  const weeklyListModel = mongoose.model('weeklies', repeatableListSchema)

  weeklyListModel.find({ }).exec((err, data) => {
    data.forEach(item => {
      weeklyListModel.findByIdAndUpdate({ _id: item.id }, { complete: false }).exec();
    })
    console.log('=========================')
    console.log('list reset')
    console.log('=========================')
  })

  console.log('script ran');

} catch(error) {
  console.log(error);
}