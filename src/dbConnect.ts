import mongoose from "mongoose";
import Logger from "./utils/logger";
import { HOST, NAMEDB, PASSWORD, USER_DEV } from "./utils/config";
const connectToMongoDb = async () => {
    const uri = `mongodb+srv://${USER_DEV}:${PASSWORD}@p${HOST}/${NAMEDB}?retryWrites=true&w=majority`
    try {
        await mongoose.connect(uri)
        Logger.info(`connection to database: established successfully`)
    } catch (error) {
        Logger.error(error)
    }
};
export default connectToMongoDb;