import mongoose from "mongoose";
const { Schema } = mongoose;

const roleUserSchema = new Schema({
    rol: String,
    description: String,
    created_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
});

const RoleUser = mongoose.model("RoleUser", roleUserSchema);
export default RoleUser;