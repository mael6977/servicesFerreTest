import { Request, Response } from 'express';
import AuditModal from '../models/audit-reports.model';
import BusinessInfo from '../models/business-info.model';


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
        const { idComercio, result, ...auditFields } = req.body;
        console.log ({ idComercio, result, ...auditFields })
        const audit = new AuditModal({ idComercio, ...auditFields });
        const savedAudit = await audit.save();
        const businessInfo = await BusinessInfo.findById(idComercio);
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