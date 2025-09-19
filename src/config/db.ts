import mongoose from 'mongoose'

 const connectDB = async () => {
    try{
     const connectionString = process.env.MONGO_URI ?? ''    
     const conn = await mongoose.connect(connectionString)
     console.log(`MongoDb connected :${conn.connection.host}`)
    }catch(err){
        console.error("MongoDB connection failed", err);
        process.exit(1)
    }
}

export default connectDB