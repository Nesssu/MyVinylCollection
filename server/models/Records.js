import { Schema, model } from "mongoose";

const Records = Schema;

let recordsSchema = new Records ({
    artist: {type: String},
    title: {type: String},
    image: {type: String},
    contentType: {type: String},
    releaseDate: {type: Date},
    number: {type: Number}
});

export default model("record", recordsSchema);