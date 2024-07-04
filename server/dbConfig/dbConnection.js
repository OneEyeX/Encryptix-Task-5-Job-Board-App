import mongoose from 'mongoose';
const dbConnection = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connection established")
    } catch (error) {
        console.log("DB error: " + error);
    }
};

export default dbConnection;