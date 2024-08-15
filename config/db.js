const mongoose = require("mongoose");
const config = require('./config')

const connect = async () => {
  try {
    await mongoose.connect(config.DB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { connect };
