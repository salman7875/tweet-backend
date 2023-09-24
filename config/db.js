const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_PROD, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("DB Connected");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { connect };
