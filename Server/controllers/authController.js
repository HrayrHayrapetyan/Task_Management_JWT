import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/User.js"

async function loginRoute(req,res){
    const { email, password } = req.body
    // console.log(req.body);

    try{
    const user = await User.findOne({ email: email }).exec()
    
    const isMatch=await bcrypt.compare(password,user.password)

    if (!isMatch){
        return res.status(401).json({message: 'Check your email or password'})
    }

    if (!user) return res.status(401).json({ message: "Invalid username or password. Please try again." })
    // console.log(user);

    const token=jwt.sign({id:user._id, role: user.role },process.env.JWT_SECRET,{expiresIn: '1h'})

    res.cookie('token',token,{
        httpOnly: true,
        maxAge:3600000,
    })
    res.redirect('/dashboard')
}
catch(err){
    res.status(401).json({message: 'User not found'})
}
}

async function registerRoute(req,res){

    const { username, email, password } = req.body;

    const duplicate = await User.findOne({ username: username, email: email }).exec()

    if (duplicate) return res.sendStatus(409).json({ message: "User or email already exists" })

    try {

        const hashedPass=await  bcrypt.hash(password,10)

        const newUser = await User.create({
            "name": username,
            "email": email,
            "password": hashedPass,
            "tasks": [],
            "role": 1,
            "createdAt": Date.now()
        })


        res.status(201).json({ 'success': `New user ${newUser} was created!` })

    } catch (error) {
        res.status(500).json({ 'message': error.message })
    }

}

const logout = (req,res)=>{

    res.clearCookie('token',{ httpOnly: true, secure: true, sameSite: 'Strict'})

    res.status(200).send('token cleared')
}
export default { loginRoute, registerRoute, logout };