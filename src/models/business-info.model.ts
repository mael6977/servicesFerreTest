import mongoose from "mongoose";
const { Schema } = mongoose;

const auditSchema = new Schema({
  auditId: { type: Schema.Types.ObjectId, ref: "Audit" },
  date: { type: Date, default: Date.now },
  result: { type: String }
}, { _id: false });

const businessInfoSchema = new Schema({
  province: String,
  locality: String,
  distributor: String,
  address: String,
  establishment: String,
  audits: { type: [auditSchema], default: [] },
  created_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
});

const BusinessInfo = mongoose.model("BusinessInfo", businessInfoSchema);
export default BusinessInfo;