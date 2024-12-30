import Routes from 'express'
import taskController from '../controllers/taskController.js';
import dotenv from 'dotenv'
import requireAuth from "../middleware/auth.js"
import User from '../models/User.js';

dotenv.config();
const routes = Routes()

routes.post('/user/assign-task',taskController.assignTask)

routes.get('/admin/users-with-tasks',async (req,res)=>{

    try{
        const users=await User.find().populate('tasks')
        return res.json(users)
    }catch(err){
        return res.status(500).json({ message : 'Server Error'})
    }
})

routes.get('/user/my-tasks', taskController.userTasks)

routes.get('/user/get-task/:taskId', requireAuth, taskController.getTask)

routes.put('/user/edit-task', taskController.editTask)

routes.put('/user/change-status',taskController.changeStatus)

routes.delete('/admin/delete-task',taskController.deleteTask)


export default routes;