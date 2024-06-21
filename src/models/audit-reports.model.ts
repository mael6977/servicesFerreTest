import mongoose from "mongoose";
const { Schema } = mongoose;

const auditSchema = new Schema({
    auditor: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    business: { type: Schema.Types.ObjectId, ref: "BusinessInfo" },
    visit: Number,
    answer0: String,
    commentAnswer0: String,
    answer1: String,
    commentAnswer1: String,
    answer2: String,
    commentAnswer2: String,
    answer3: String,
    commentAnswer3: String,
    answer4: String,
    commentAnswer4: String,
    answer5: String,
    commentAnswer5: String,
    answer6: String,
    commentAnswer6: String,
    answer7: String,
    commentAnswer7: String,
    answer8: String,
    commentAnswer8: String,
    created_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
});

const AuditSchema = mongoose.model("audit", auditSchema);
export default AuditSchema;