import { Document, Types } from 'mongoose';

export interface Audit extends Document {
  idComercio: {
    _id: Types.ObjectId;
    province: string;
    locality: string;
    distributor: string;
    address: string;
    establishment: string;
    audits: any[];
    created_date: Date;
    update_date: Date;
  };
  idAuditor: {
    _id: Types.ObjectId;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: Types.ObjectId;
    created_date: Date;
    update_date: Date;
  };
  producto: string;
  visita: number;
  result: 'OK' | 'KO' | 'DEFAULT' | '';
  resultComment: string;
  apertura: 'SI' | 'NO' | '';
  aperturaComment: string;
  nevera: 'SI' | 'NO' | '';
  neveraComment: string;
  neveraContenido: 'SI' | 'NO' | '';
  neveraContenidoComment: string;
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
  competenciaNeveraPresencia: string;
  competenciaNeveraCantidad: string;
  competenciaNeveraMarca: string;
  created: Date;
  updated: Date;
}