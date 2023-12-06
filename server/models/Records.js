const mongoose = require("mongoose");

const Records = mongoose.Schema;

let recordsSchema = new Records ({
    artist: {type: String},
    title: {type: String},
    image: {type: String},
    contentType: {type: String},
    number: {type: Number}
});

module.exports = mongoose.model("record", recordsSchema);