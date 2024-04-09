const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    mimetype: String,
    size: Number,
    path: String
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
