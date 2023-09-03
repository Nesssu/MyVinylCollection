const mongoose = require("mongoose");

const Admin = mongoose.Schema;

let adminSchema = new Admin ({
    id: {type: String},
    password: {type: String},
});

module.exports = mongoose.model("admin", adminSchema);