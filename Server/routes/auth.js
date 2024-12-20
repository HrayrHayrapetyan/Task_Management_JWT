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
    console.log('inside dashboard');
    
    res.sendFile(path.join(dirname,'dashboard.html'));

})

routes.get('/user/username',async (req,res)=>{
    console.log('inside the username endpoint');
    
    const token=req.cookies.token
    console.log('getting the cookie');
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const userId=decoded.id
        console.log('token verified, user id : ',userId);
        
        const user=await User.findById(userId).select('name').populate('tasks').exec()
        console.log('found the user');
        console.log('username', user.name);
        console.log('tasks ',user.tasks);
        
        if (!user){
            res.status(404).json({message: 'Username not found'})
        }

        res.status(200).json({username: user.name,
                                tasks: user.tasks})

    }catch(err){
        res.status(401).json({message:'invalid token'})
    }

})

routes.post('/api/register', async (req, res) => {

    console.log('inside register back end');

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

        const newUser = await User.create({
            "name": username,
            "email": email,
            "password": hashedPass,
            "tasks": [task],
            "role": "User",
            "createdAt": Date.now()
        })

        console.log(newUser);
        res.status(201).json({ 'success': `New user ${newUser} was created!` })

    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }

})

routes.post('/api/login', async (req, res) => {

    console.log('inside the login back endpoint');

    const { email, password } = req.body
    // console.log(req.body);

    const user = await User.findOne({ email: email }).exec()
    console.log(user);  
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

export default routes;
