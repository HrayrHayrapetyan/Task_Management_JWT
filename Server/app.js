import express from 'express'
import dbConnect from './config/db.js'
import cors from 'cors'
import authRoutes from "./routes/auth.js"
import path from 'path'
import cookieParser from 'cookie-parser'
import taskRoutes from "./routes/task.js"
import requireAuth from './middleware/auth.js'
const app=express()

const dirname = path.join(process.cwd(), '..',);

app.use(cookieParser())

app.use(express.static(path.join(dirname, 'Client')))

app.use(express.json())
app.use(cors())


app.use(authRoutes)
app.use(requireAuth, taskRoutes)
const port=3000

dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port: ${port}`)
        })
    })





