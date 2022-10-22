const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TypeTable = new Schema({
    view : {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('TypeTable', TypeTable);
