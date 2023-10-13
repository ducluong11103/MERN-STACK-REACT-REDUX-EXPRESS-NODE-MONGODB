const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((data) => {
    console.log(`Mongodb connected with server: ${data.connections[0].host}`);
  }).catch((err) => {
    console.log(err);
  });
}

module.exports = connectDatabase;
