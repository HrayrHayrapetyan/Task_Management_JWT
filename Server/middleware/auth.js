import jwt from "jsonwebtoken"

function requireAuth (req, res, next) {
    
    const token = req.cookies.token;
        
    if (token) {
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if (err){
                return res.status(401).json({message: 'Invalid or expired token'})
            } 
            res.user = decoded;
          return next();
        })
    }
    else {
        return res.redirect('/login')
    }
}


export default requireAuth
