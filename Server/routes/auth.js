import Routes from 'express'
import path from 'path';
import dotenv from 'dotenv'
dotenv.config();
import authController from '../controllers/authController.js';
import requireAuth from "../middleware/auth.js"
import taskController from '../controllers/taskController.js';
const routes = Routes()

const dirname = path.join(process.cwd(), '..', 'Client', 'Pages'); 

//head to the landing page when the website is loaded
routes.get("/", (req, res) => {

    //if a logged user's token is still valid, head to its dashboard
    if (req.cookies.token){
        return res.redirect('/dashboard')
    }

    return res.sendFile(path.join(dirname, 'landingPage.html'));
})

routes.get("/login", (req, res) => {
    return res.sendFile(path.join(dirname, 'login.html'));
})

routes.get("/register", (req, res) => {
    return res.sendFile(path.join(dirname, 'register.html'));
})

routes.get('/dashboard',requireAuth, (req, res) => {
    return res.sendFile(path.join(dirname,'dashboard.html'));
})

routes.post('/api/register',authController.registerRoute)

routes.post('/api/login', authController.loginRoute)


routes.post('/logout', authController.logout)

routes.delete('/admin/delete-user',taskController.deleteUser)

export default routes;
