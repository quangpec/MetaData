const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rootSchema = new Schema({
    heading:{
        type: String,
        required: true
        },
    name_Collection:{
    type: String,
    required: true
    },
    name_CollectionView:{
        type: String,
        required: true
    },
    numCol:{
        type: Number,
        required: true
    },
    schema: {
        type: Array,
        required: true,
    }
})
module.exports = mongoose.model('RootSchema', rootSchema);