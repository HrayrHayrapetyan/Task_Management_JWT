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
    status:{
        type: String,
        default: 'To Do'
    },
    dueDate: {
        type: String
    },
    assignedUser: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    priority: {
        type: String
    }
})

const Task=mongoose.model('Task',taskSchema) 

export default Task;
