import mongoose from "mongoose";
const { Schema } = mongoose;

const userProfileSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    role: { type: Schema.Types.ObjectId, ref: "RoleUser" },
    created_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;