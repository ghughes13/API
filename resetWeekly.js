const mongoose = require("mongoose");

const dbpass = process.env.DBPASS;
const dbUser = process.env.DBUSER;

try {
  mongoose.connect(
    `mongodb+srv://${dbpass}:${dbUser}@todolist900-qitpr.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  mongoose.connection.on("connected", () => {});

  const Schema = mongoose.Schema;

  const repeatableListSchema = new Schema({
    task: String,
    complete: Boolean,
  });

  const weeklyListModel = mongoose.model("weeklies", repeatableListSchema);

  weeklyListModel.find({}).exec((err, data) => {
    data.forEach((item) => {
      weeklyListModel
        .findByIdAndUpdate({ _id: item.id }, { complete: false })
        .exec();
    });
  });
} catch (error) {
  console.log(error);
}
