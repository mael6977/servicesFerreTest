import { Request, Response } from 'express';
import Audit from '../models/audit-reports.model';

export const getAudits = async (_req: Request, res: Response): Promise<void> => {
    try {
        const audits = await Audit.find().populate('auditor').populate('business');
        res.status(200).json(audits);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

export const getAuditById = async (req: Request, res: Response): Promise<void> => {
    try {
        const audit = await Audit.findById(req.params.id).populate('auditor').populate('business');
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
    console.log("auditoria", req)
    try {
        const audit = new Audit(req.body);
        const savedAudit = await audit.save();
        res.status(201).json(savedAudit);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

export const updateAudit = async (req: Request, res: Response): Promise<void> => {
    try {
        const audit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const audit = await Audit.findByIdAndDelete(req.params.id);
        if (audit) {
            res.status(200).json({ message: 'Audit deleted successfully' });
        } else {
            res.status(404).json({ message: 'Audit not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    }
};