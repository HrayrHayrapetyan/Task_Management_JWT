import mongoose from 'mongoose'
const Schema=mongoose.Schema


const taskSchema=new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Task=mongoose.model('Task',taskSchema) 

//module.exports=Task this code only for required
//for moduls have this way
export default Task;
