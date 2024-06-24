import { Document, Types } from 'mongoose';

export interface Audit extends Document {
  idComercio: Types.ObjectId;
  idAuditor: Types.ObjectId;
  producto: string;
  visita: number;
  apertura: 'SI' | 'NO';
  aperturaComment: string;
  nevera: 'SI' | 'NO';
  neveraComment: string;
  neveraContenido: 'SI' | 'NO';
  neveraContenidoDetalle: string;
  lugarNevera1: string;
  neveraCantidad: number;
  productoNevera1: string;
  productoNevera1Comment: string;
  lugarNevera2: string;
  productoNevera2: string;
  productoNevera2Comment: string;
  result: 'OK' | 'NO';
  resultComment: string;
  created: Date;
  updated: Date;
}
