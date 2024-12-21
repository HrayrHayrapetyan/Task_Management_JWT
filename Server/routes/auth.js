import Routes from 'express'
import dbConnect from '../config/db.js'
import User from '../models/User.js'
import Task from '../models/Task.js'
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import requireAuth from '../middleware/auth.js';
import bcrypt from 'bcrypt'

dotenv.config();
const dirname = path.join(process.cwd(), '..', 'Client', 'Pages'); // Correctly resolve the path

const routes = Routes()

routes.get("/", (req, res) => {
    res.sendFile(path.join(dirname, 'login.html'));
})

routes.get("/login", (req, res) => {
    res.sendFile(path.join(dirname, 'login.html'));
})

routes.get("/register", (req, res) => {
    res.sendFile(path.join(dirname, 'register.html'));
})

routes.get('/dashboard',requireAuth, (req, res) => {
    
    res.sendFile(path.join(dirname,'dashboard.html'));

})

routes.get('/user/username',async (req,res)=>{
    
    const token=req.cookies.token
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const userId=decoded.id
        
        
        const user=await User.findById(userId).select('name').select('role').populate('tasks').exec()
      
        
        if (!user){
            res.status(404).json({message: 'Username not found'})
        }

        res.status(200).json({username: user.name,
                                tasks: user.tasks,
                                role: user.role})

    }catch(err){
        res.status(401).json({message:'invalid token'})
    }

})

routes.post('/api/register', async (req, res) => {

    

    const { username, email, password } = req.body;

    const duplicate = await User.findOne({ username: username, email: email }).exec()

    if (duplicate) return res.sendStatus(409).json({ message: "User or email already exists" })

    try {

        const hashedPass=await  bcrypt.hash(password,10)

        const task=await Task.create({
            "name": "user's task",
            "description": "easiest task ever",
            "dueDate": '01.05.2025',
            "createdAt": Date.now(),
            "priority": 'High'
        }) 
        const task2=await Task.create({
            "name": "another one",
            "description": "another taskanother taskanother taskanother taskanother taskanother taskanother taskanother taskanother taskanother taskanother taskanother task",
            "dueDate": '01.06.2025',
            "createdAt": Date.now(),
            "priority": 'Low'
        })
        

        const newUser = await User.create({
            "name": username,
            "email": email,
            "password": hashedPass,
            "tasks": [task,task2],
            "role": 1,
            "createdAt": Date.now()
        })


        res.status(201).json({ 'success': `New user ${newUser} was created!` })

    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }

})

routes.post('/api/login', async (req, res) => {

    

    const { email, password } = req.body
    // console.log(req.body);

    const user = await User.findOne({ email: email }).exec()
    
    const isMatch=await bcrypt.compare(password,user.password)

    if (!isMatch){
        res.status(401).json({message: 'Check your email or password'})
    }

    if (!user) return res.status(401).json({ message: "Invalid username or password. Please try again." })
    // console.log(user);

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '1h'})

    res.cookie('token',token,{
        httpOnly: true,
        maxAge:3600000,
    })
    res.redirect('/dashboard')
})

routes.post('/user/assignTask',async (req,res)=>{
    console.log('inside assign task');
    

   const {taskName,description,dueDate,priority,assignedUser}=req.body
    console.log(taskName);
    console.log(description);
    console.log(dueDate);
    console.log(priority);
    console.log(assignedUser)

    const formattedDate = new Date(dueDate).toISOString().slice(0, 10);


    const assignedTask=await Task.create({
        name: taskName,
        description: description,
        dueDate: formattedDate,
        priority: priority
    })

    console.log('After adding to db ', assignedTask);

    try{
    const user=await User.findOneAndUpdate({name: assignedUser},{$push: {tasks: assignedTask}},{new: true})
    console.log('our user ',user);
    
    console.log('user found and task updated');
    
    if (!user) res.status(401).json({message: 'Username not found'})

    res.status(200).json({message: 'task assigned successfully'})
    }
    catch(error){
        console.error('Error updating user by username:',error)
    }
   
})


routes.post('/logout',(req,res)=>{

    res.clearCookie('token',{ httpOnly: true, secure: true, sameSite: 'Strict'})

    res.status(200).send('token cleared')
})

export default routes;
