const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
  {
    id: Number,
    YTUrl: String,
    inputSubsJson: {
      valid: Boolean,
      cues: [
        {
          identifier: String,
          start: String,
          end: String,
          text: String,
          styles: String
        }
      ]
    }
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
