const mongoose = require("mongoose");

const Records = mongoose.Schema;

let recordsSchema = new Records ({
    artist: {type: String},
    title: {type: String},
    image: {type: String},
    contentType: {type: String},
    releaseDate: {type: String},
    number: {type: String}
});

module.exports = mongoose.model("record", recordsSchema);