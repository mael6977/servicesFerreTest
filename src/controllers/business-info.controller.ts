import { Request, Response } from "express";
import BusinessInfo from "../models/business-info.model";
import mongoose from "mongoose";

export const getBusinessInfos = async (_req: Request, res: Response): Promise<void> => {
    try {
        const businessInfos = await BusinessInfo.find();
        res.status(200).json(businessInfos);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getBusinessInfoById = async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id)
    try {
        const businessInfo = await BusinessInfo.findById(req.params.id);
        console.log(businessInfo)
        if (!businessInfo) {
            res.status(404).json({ message: "BusinessInfo no encontrado" });
        } else {
            res.status(200).json(businessInfo);
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const createBusinessInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body.data;

        if (!Array.isArray(data)) {
            res.status(400).json({ message: 'El formato de datos es incorrecto. Se esperaba un arreglo llamado "data".' });
            return;
        }

        const savedBusinessInfos = [];
        for (const item of data) {
            const businessInfo = new BusinessInfo(item);
            const savedBusinessInfo = await businessInfo.save();
            savedBusinessInfos.push(savedBusinessInfo);
        }

        res.status(201).json(savedBusinessInfos);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};


export const getBusinessInfoBySearch = async (req: Request, res: Response): Promise<void> => {
    try {
        let { province, locality, address, establishment } = req.query;
        const filter: { [key: string]: any } = {};

        if (!province && !locality && !address && !establishment) {
            const provinces = await BusinessInfo.aggregate([
                { $group: { _id: '$province' } },
                { $sort: { _id: 1 } }
            ]).exec();
            res.status(200).json(provinces);
            return;
        }

        if (province) {
            filter.province = province;

            if (!locality && !establishment && !address) {
                const localities = await BusinessInfo.aggregate([
                    { $match: { province: province } },
                    { $group: { _id: '$locality' } },
                    { $sort: { _id: 1 } }
                ]).exec();
                res.status(200).json(localities);
                return;
            }
        }

        if (locality && province) {
            filter.province = province;
            filter.locality = locality;

            if (!establishment && !address) {
                const establishments = await BusinessInfo.aggregate([
                    { $match: { province: province, locality: locality } },
                    { $group: { _id: '$establishment' } },
                    { $sort: { _id: 1 } } 
                ]).exec();
                res.status(200).json(establishments);
                return;
            }
        }

        if (establishment && locality && province) {
            filter.province = province;
            filter.locality = locality;
            filter.establishment = establishment;

            if (!address) {
                const addresses = await BusinessInfo.aggregate([
                    { $match: { province: province, locality: locality, establishment: establishment } },
                    { $group: { _id: '$address' } },
                    { $sort: { _id: 1 } } 
                ]).exec();
                res.status(200).json(addresses);
                return;
            }
        }

        if (address && establishment && locality && province) {
            filter.province = province;
            filter.locality = locality;
            filter.establishment = establishment;
            filter.address = address;
            const result = await BusinessInfo.findOne(filter).exec();
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'Negocio no encontrado' });
            }
            return;
        }
        res.status(400).json({ error: 'Parámetros de búsqueda incorrectos o insuficientes' });
    } catch (err) {
        console.error('Error al buscar datos:', err);
        res.status(500).json({ error: 'Error al buscar datos' });
    }
};

export const addAuditToBusinessInfo = async (req: Request, res: Response): Promise<any> => {
    const { businessInfoId } = req.params;
    const { auditId, result } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(auditId)) {
            return res.status(400).json({ error: 'Invalid auditId' });
        }
        const businessInfo = await BusinessInfo.findById(businessInfoId);
        if (!businessInfo) {
            return res.status(404).json({ error: 'BusinessInfo not found' });
        }
        const newAudit = {
            auditId: auditId,
            date: new Date(),
            result: result
        };
        businessInfo.audits.push(newAudit);
        await businessInfo.save();
        res.status(201).json({ message: 'Audit added successfully', businessInfo });
    } catch (error) {
        console.error('Error adding audit:', error);
        res.status(500).json({ error: 'Failed to add audit' });
    }
};

export const updateBusinessInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedBusinessInfo = await BusinessInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBusinessInfo) {
            res.status(404).json({ message: "BusinessInfo no encontrado" });
        } else {
            res.status(200).json(updatedBusinessInfo);
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteBusinessInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedBusinessInfo = await BusinessInfo.findByIdAndDelete(req.params.id);
        if (!deletedBusinessInfo) {
            res.status(404).json({ message: "BusinessInfo no encontrado" });
        } else {
            res.status(200).json({ message: "BusinessInfo eliminado" });
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }
};