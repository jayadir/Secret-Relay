import mongoose from "mongoose";

type DBConfig = {
    isConnected?:number;
}
const connection:DBConfig = {};

export const connect = async ():Promise<void> => {
    if(connection.isConnected){
        console.log("Using existing connection");
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGO_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to db");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}
