import mongoose from "mongoose";
import { Audit } from "../interfaces/audit.interface";
const { Schema } = mongoose;
const AuditSchema = new Schema({
    idComercio: { type: Schema.Types.ObjectId, ref: 'BusinessInfo' },
    idAuditor: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    producto: { type: String },
    visita: { type: Number },
    apertura: { type: String, enum: ['SI', 'NO'] },
    aperturaComment: { type: String },
    nevera: { type: String, enum: ['SI', 'NO'] },
    neveraComment: { type: String },
    neveraContenido: { type: String, enum: ['SI', 'NO'] },
    neveraContenidoDetalle: { type: [String] },
    lugarNevera1: { type: [String] },
    productoNevera1: { type: String },
    productoNevera1Comment: { type: String },
    lugarNevera2: { type: [String] },
    productoNevera2: { type: String },
    productoNevera2Comment: { type: String },
    result: { type: String, enum: ['OK', 'KO', 'DEFAULT'] },
    resultComment: { type: String },
    created: { type: Date, default: Date.now, required: true },
    updated: { type: Date, default: Date.now, required: true }
});
const AuditModel = mongoose.model<Audit>('Audit', AuditSchema);
export default AuditModel;


