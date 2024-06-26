import mongoose from "mongoose";
import { Audit } from "../interfaces/audit.interface";
const { Schema } = mongoose;
const AuditSchema = new Schema({
    idComercio: { type: Schema.Types.ObjectId, ref: 'BusinessInfo' },
    idAuditor: { type: Schema.Types.ObjectId, ref: 'UserProfile' },
    producto: { type: String, default: null },
    visita: { type: Number, default: null },
    result: { type: String, enum: ['OK', 'KO', 'DEFAULT', ''], default: '' },
    resultComment: { type: String, default: '' },
    apertura: { type: String, enum: ['SI', 'NO', ''], default: '' },
    aperturaComment: { type: String, default: '' },
    nevera: { type: String, enum: ['SI', 'NO', ''], default: '' },
    neveraComment: { type: String, default: '' },
    neveraContenido: { type: String, enum: ['SI', 'NO', ''], default: '' },
    neveraContenidoComment: { type: String, default: '' },
    neveraContenidoDetalle: { type: [String], default: [] },
    neveraCantidad: { type: Number },
    productoNevera1: { type: String, default: '' },
    productoNevera1Comment: { type: String, default: '' },
    lugarNevera1: { type: [String], default: [] },
    fotosNevera1: { type: [String], default: [] },
    productoNevera2: { type: String, default: '' },
    productoNevera2Comment: { type: String, default: '' },
    lugarNevera2: { type: [String], default: [] },
    fotosNevera2: { type: [String], default: [] },
    competenciaNeveraPresencia : { type: String, default: '' },
    competenciaNeveraCantidad  : { type: String, default: '' },
    competenciaNeveraMarca : { type: String, default: '' },
    created: { type: Date, default: Date.now, required: true },
    updated: { type: Date, default: Date.now, required: true }
});
const AuditModel = mongoose.model<Audit>('Audit', AuditSchema);
export default AuditModel;


