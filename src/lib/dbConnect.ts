import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to the database.");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "")

        connection.isConnected = db.connections[0].readyState
        console.log("DB connection successfull");
        
    } catch (error) {
        console.log("Error connecting to the database");
        process.exit(1);
    }
}

export default dbConnect;