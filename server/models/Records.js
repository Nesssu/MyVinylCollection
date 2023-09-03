import { Schema, model } from "mongoose";

const Records = Schema;

let recordsSchema = new Records ({
    artist: {type: String},
    title: {type: String},
    about: {type: Text},
    number: {type: Number}
});

export default model("record", recordsSchema);