const mongoose = require("mongoose");

try {
  mongoose.connect(
    "mongodb+srv://Self-Taught-Dev:OpNJ3was2dAbOT8h@selftaughtdev.exocz.mongodb.net/ProjectArchiveData?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  mongoose.connection.on("connected", () => {});

  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    accountType: String,
  });

  //Models
  const newUserModel = mongoose.model("users", userSchema);

  const newUser = new newUserModel({
    userName: "test",
    password: "test",
    firstName: "test",
    lastName: "test",
    email: "test",
    accountType: "lite",
  });

  newUser.save((error) => {
    if (error) {
      console.log("error");
    } else {
      console.log("saved data!");
    }
  });
} catch (err) {
  console.log(err);
}
