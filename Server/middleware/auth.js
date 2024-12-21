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
        res.status(401).json({message:'No token provided'})
    }
}

export default requireAuth
