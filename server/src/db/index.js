import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connect_db = async () => {
    try {
        let connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`connected to database successfully ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("failed to connect to the database", error)
        process.exit(1)
    }
}
export { connect_db }