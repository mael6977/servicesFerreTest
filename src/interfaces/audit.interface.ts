import { Document, Types } from 'mongoose';

export interface Audit extends Document {
  idComercio: Types.ObjectId;
  idAuditor: Types.ObjectId;
  producto: string;
  visita: number;
  result: 'OK' | 'KO' | 'DEFAULT' | '';
  resultComment: string;
  apertura: 'SI' | 'NO' | '';
  aperturaComment: string;
  nevera: 'SI' | 'NO' | '';
  neveraComment: string;
  neveraContenido: 'SI' | 'NO' | '';
  neveraContenidoComment: string,
  neveraContenidoDetalle: string[];
  neveraCantidad?: number;
  productoNevera1: string;
  productoNevera1Comment: string;
  lugarNevera1: string[];
  fotosNevera1: string[];
  productoNevera2: string;
  productoNevera2Comment: string;
  lugarNevera2: string[];
  fotosNevera2: string[];
  competenciaNeveraPresencia : string,
  competenciaNeveraCantidad  : string,
  competenciaNeveraMarca : string,
  created: Date;
  updated: Date;
}
