const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PersonSchema = new mongoose.Schema({
    _id: { type: String, default: () => uuidv4() },
    name: String,
    number: String,
});

module.exports = mongoose.model('Person', PersonSchema);
