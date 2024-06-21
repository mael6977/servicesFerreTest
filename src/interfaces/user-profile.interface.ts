import { Types } from "mongoose";

export interface IUserProfile extends Document {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: Types.ObjectId
}