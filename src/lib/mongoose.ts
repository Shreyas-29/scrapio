import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URI) return console.error("MONGODB_URI not found");

    if (isConnected) return console.log("Using existing database connection");

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log("CONNECTED!");

    } catch (error) {

    }

}
// 