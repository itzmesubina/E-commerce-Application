const sessionSecret = process.env.SESSION_SECRET;
const mongoose = require("mongoose");
module.exports = {  
  sessionSecret,
  dbConnect: (cb) => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODB_URL);

    const db = mongoose.connection;

    db.on("open", () => {
      cb(true);
    });

    db.once("error", (err) => {
      cb(false);
      console.log(err);
    });
  },
};
