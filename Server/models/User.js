import mongoose from 'mongoose'
const Schema=mongoose.Schema

const userSchema= new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [6,'Password must be at least 6 characters long ']
    },
    tasks:[{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    role:{
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Intl.DateTimeFormat('en-GB').format(new Date(Date.now()))
    }
})

const User=mongoose.model('User',userSchema)
// module.exports=User
export default User;