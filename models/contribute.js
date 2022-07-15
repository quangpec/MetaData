import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

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
      type: String,
      required:true
    }
});

export default model('Contribute', contributeSchema);
