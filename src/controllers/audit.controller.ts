import { Request, Response } from 'express';
import AuditModal from '../models/audit-reports.model';
import BusinessInfo from '../models/business-info.model';
import moment from 'moment';
import ExcelJS from 'exceljs';
import { Audit } from '../interfaces/audit.interface';
import AuditModel from '../models/audit-reports.model';

export const getAudits = async (_req: Request, res: Response): Promise<void> => {
    try {
        const audits = await AuditModal.find().populate('auditor').populate('business');
        res.status(200).json(audits);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

export const getAuditById = async (req: Request, res: Response): Promise<void> => {
    try {
        const audit = await AuditModal.findById(req.params.id).populate('auditor').populate('business');
        if (audit) {
            res.status(200).json(audit);
        } else {
            res.status(404).json({ message: 'Audit not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

export const createAudit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { establishment, auditor, distribuitor, visit, result: initialResult, resultComment, questions } = req.body;
        const fieldMapping: { [key: string]: string } = {
            'APERTURA': 'apertura',
            'APERTURA COMMENT': 'aperturaComment',
            'NEVERA': 'nevera',
            'NEVERA COMMENT': 'neveraComment',
            'NEVERA CONTENIDO': 'neveraContenido',
            'NEVERA CONTENIDO DETALLE': 'neveraContenidoDetalle',
            'NEVERA CANTIDAD': 'neveraCantidad',
            'PRODUCTO NEVERA 1': 'productoNevera1',
            'PRODUCTO NEVERA 1 COMMENT': 'productoNevera1Comment',
            'LUGAR NEVERA 1': 'lugarNevera1',
            'FOTOS NEVERA 1': 'fotosNevera1',
            'PRODUCTO NEVERA 2': 'productoNevera2',
            'PRODUCTO NEVERA 2 COMMENT': 'productoNevera2Comment',
            'LUGAR NEVERA 2': 'lugarNevera2',
            'FOTOS NEVERA 2': 'fotosNevera2',
            'COMPETENCIA NEVERA PRESENCIA': 'competenciaNeveraPresencia',
            'COMPETENCIA NEVERA CANTIDAD': 'competenciaNeveraCantidad',
            'COMPETENCIA NEVERA MARCA': 'competenciaNeveraMarca',
        };
        const mappedQuestions: { [key: string]: string } = {};
        questions.forEach((question: { id: number, title: string, answer: string }) => {
            const field = fieldMapping[question.title];
            if (field) {
                mappedQuestions[field] = question.answer;
            }
        });
        let result: string;
        if ((mappedQuestions['apertura'] === 'NO' && visit === 0) || (mappedQuestions['nevera'] === 'NO' && visit === 0)) {
            result = 'DEFAULT';
        } else if (mappedQuestions['apertura'] === 'SI' && mappedQuestions['nevera'] === 'SI') {
            result = initialResult === 'SI' ? 'OK' : 'KO';
        } else {
            result = 'KO';
        }
        const auditFields: any = {
            idComercio: establishment,
            idAuditor: auditor,
            producto: distribuitor,
            visita: visit + 1,
            result,
            resultComment,
            created: new Date(),
            updated: new Date()
        };
        Object.keys(mappedQuestions).forEach(key => {
            const value = mappedQuestions[key];
            if (value.startsWith('[') && value.endsWith(']')) {
                auditFields[key] = JSON.parse(value);
            } else {
                auditFields[key] = value;
            }
        });
        const audit = new AuditModal(auditFields);
        const savedAudit = await audit.save();
        const businessInfo = await BusinessInfo.findById(establishment);
        if (!businessInfo) {
            res.status(404).json({ error: 'BusinessInfo not found' });
            return;
        }
        businessInfo.audits.push({ auditId: savedAudit._id, date: new Date(), result });
        await businessInfo.save();
        res.status(201).json({ message: 'Audit created and added successfully', businessInfo });
    } catch (error) {
        console.error('Error creating audit and updating business info:', error);
        res.status(500).json({ error: 'Failed to create audit and update business info' });
    }
};

export const updateAudit = async (req: Request, res: Response): Promise<void> => {
    try {
        const audit = await AuditModal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (audit) {
            res.status(200).json(audit);
        } else {
            res.status(404).json({ message: 'Audit not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

interface QueryParamsDate {
    startDate: string;
    endDate: string;
}

export const generateAuditReportExcel = async (req: Request<{}, {}, {}, QueryParamsDate>, res: Response): Promise<void> => {
    const { startDate, endDate } = req.query;
    try {
        const audits = await AuditModel.find({
            created: {
                $gte: moment(startDate, 'YYYY-MM-DD').startOf('day').toDate(),
                $lte: moment(endDate, 'YYYY-MM-DD').endOf('day').toDate(),
            },
        }).populate('idAuditor').populate('idComercio');
        if (!audits || audits.length === 0) {
            res.status(404).json({ message: 'No audits found for the specified date range' });
            return;
        }
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Audits');
        worksheet.columns = [
            { header: 'ID Auditoría', key: 'id', width: 10 },
            { header: 'Comercio', key: 'establishment', width: 30 },
            { header: 'Auditor', key: 'auditor', width: 20 },
            { header: 'Producto', key: 'producto', width: 20 },
            { header: 'Visita', key: 'visita', width: 10 },
            { header: 'Resultado', key: 'result', width: 15 },
            { header: 'Comentario Resultado', key: 'resultComment', width: 30 },
            { header: 'Apertura', key: 'apertura', width: 10 },
            { header: 'Comentario Apertura', key: 'aperturaComment', width: 30 },
            { header: 'Nevera', key: 'nevera', width: 10 },
            { header: 'Comentario Nevera', key: 'neveraComment', width: 30 },
            { header: 'Contenido Nevera', key: 'neveraContenido', width: 15 },
            { header: 'Detalle Contenido Nevera', key: 'neveraContenidoDetalle', width: 30 },
            { header: 'Cantidad Nevera', key: 'neveraCantidad', width: 15 },
            { header: 'Producto Nevera 1', key: 'productoNevera1', width: 20 },
            { header: 'Comentario Producto Nevera 1', key: 'productoNevera1Comment', width: 30 },
            { header: 'Lugar Nevera 1', key: 'lugarNevera1', width: 20 },
            { header: 'Fotos Nevera 1', key: 'fotosNevera1', width: 30 },
            { header: 'Producto Nevera 2', key: 'productoNevera2', width: 20 },
            { header: 'Comentario Producto Nevera 2', key: 'productoNevera2Comment', width: 30 },
            { header: 'Lugar Nevera 2', key: 'lugarNevera2', width: 20 },
            { header: 'Fotos Nevera 2', key: 'fotosNevera2', width: 30 },
            { header: 'Presencia de Neveras de la Competencia', key: 'competenciaNeveraPresencia', width: 30 },
            { header: 'Cantidad de Neveras de la Competencia', key: 'competenciaNeveraCantidad', width: 30 },
            { header: 'Marca de Neveras de la Competencia', key: 'competenciaNeveraMarca', width: 30 },
            { header: 'Fecha Creación', key: 'created', width: 20 },
            { header: 'Fecha Actualización', key: 'updated', width: 20 },
        ];
        audits.forEach((audit: Audit) => {
            worksheet.addRow({
                id: audit._id,
                establishment: audit.idComercio ? audit.idComercio.toString() : 'No especificado',
                auditor: audit.idAuditor ? audit.idAuditor.toString() : 'No especificado',
                producto: audit.producto || 'No especificado',
                visita: audit.visita || 0,
                result: audit.result || 'No especificado',
                resultComment: audit.resultComment || '',
                apertura: audit.apertura || 'No especificado',
                aperturaComment: audit.aperturaComment || '',
                nevera: audit.nevera || 'No especificado',
                neveraComment: audit.neveraComment || '',
                neveraContenido: audit.neveraContenido || 'No especificado',
                neveraContenidoDetalle: audit.neveraContenidoDetalle.join(', ') || '',
                neveraCantidad: audit.neveraCantidad || 0,
                productoNevera1: audit.productoNevera1 || '',
                productoNevera1Comment: audit.productoNevera1Comment || '',
                lugarNevera1: audit.lugarNevera1.join(', ') || '',
                fotosNevera1: audit.fotosNevera1.join(', ') || '',
                productoNevera2: audit.productoNevera2 || '',
                productoNevera2Comment: audit.productoNevera2Comment || '',
                lugarNevera2: audit.lugarNevera2.join(', ') || '',
                fotosNevera2: audit.fotosNevera2.join(', ') || '',
                competenciaNeveraPresencia: audit.competenciaNeveraPresencia || 'No especificado',
                competenciaNeveraCantidad: audit.competenciaNeveraCantidad || 'No especificado',
                competenciaNeveraMarca: audit.competenciaNeveraMarca || 'No especificado',
                created: moment(audit.created).format('YYYY-MM-DD HH:mm:ss'),
                updated: moment(audit.updated).format('YYYY-MM-DD HH:mm:ss'),
            });
        });
        const excelBuffer = await workbook.xlsx.writeBuffer();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="audits-${startDate}-${endDate}.xlsx"`,
        });
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error generating audit report:', error);
        res.status(500).json({ error: 'Failed to generate audit report' });
    }
};

export const deleteAudit = async (req: Request, res: Response): Promise<void> => {
    try {
        const audit = await AuditModal.findByIdAndDelete(req.params.id);
        if (audit) {
            res.status(200).json({ message: 'Audit deleted successfully' });
        } else {
            res.status(404).json({ message: 'Audit not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};