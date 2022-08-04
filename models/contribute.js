const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contributeSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }, 
    projectId:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project'
    },
    contributionAmount:{
      type: Number,
      required: true,
    },
    status:{
      type: String,
      required:true
    },
    conDate:{
      type: Date,
      required:true
    }
});
module.exports = mongoose.model('Contribute', contributeSchema);

