import mongoose from 'mongoose'

const dbConnect=async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/myDatabase')
        console.log('Db Connected ');
        
    }
    catch(error){
        console.error('Error connecting to the database',error)
        process.exit(1);  // Exit the process if the DB connection fails        
    }
}

export default dbConnect



