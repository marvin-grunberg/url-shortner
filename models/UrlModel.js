const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  clicks: [
    {
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = Url = mongoose.model("url", urlSchema);
