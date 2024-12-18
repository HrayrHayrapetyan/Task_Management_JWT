import express from 'express'
import User from './models/User.js'
import Task from './models/Task.js'
import dbConnect from './config/db.js'
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import path from 'path'
import cookieParser from 'cookie-parser'

const app=express()

const dirname = path.join(process.cwd(), '..',); // Correctly resolve the path
app.use(cookieParser())

app.use(express.static(path.join(dirname, 'Client')))

app.use(express.json())
app.use(cors())


app.use(authRoutes)
const port=3000

dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port: ${port}`)
        })
    })





