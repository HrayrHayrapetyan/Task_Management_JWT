import Routes from 'express'
import dbConnect from '../config/db.js'
import User from '../models/User.js'
import Task from '../models/Task.js'
import bcrypt from 'bcrypt'
import path from 'path';

const dirname = path.join(process.cwd(), '..', 'Client', 'Pages'); // Correctly resolve the path

const routes = Routes()

routes.get("/", (req, res) => {
    res.sendFile(path.join(dirname,'login.html' ));
})

routes.get("/register",(req,res) => {
    res.sendFile(path.join(dirname,'register.html' ));
})


routes.post('/api/register', async (req,res)=>{

    console.log('inside register back end');

    const {username, email, password } = req.body;
    
    const duplicate = await User.findOne({username:username,email:email}).exec()

    if (duplicate) return res.sendStatus(409).json({message:"User or email already exists"})

    try{

    //    const hashedPass=await  bcrypt.hash(password,10)

       const newUser=await  User.create({
        "name": username,
        "email": email,
        "password": password,
        "tasks": [],
        "role": "User",
        "createdAt": Date.now()
       })

       console.log(newUser);
       res.status(201).json({'success': `New user ${newUser} was created!`})

    }catch(error){
        res.status(500).json({'message': error.message})
    }
    
})

routes.post('/api/login',async (req,res)=>{
    
    console.log('inside the login back endpoint');

    const {email,password}=req.body
    console.log(req.body);
    
    const user=await User.findOne({email: email,password: password})

    if (!user) return res.status(401).json({message:"Invalid username or password. Please try again."})
    
    res.status(200).json({message:"Login successfull"})
  
})


export default routes;