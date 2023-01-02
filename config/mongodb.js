const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { j: true },
    });
    console.log("connected to database");
  } catch (err) {
    console.log("could not connect", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
