import { Request, Response } from "express";
import BusinessInfo from "../models/business-info.model";

export const getBusinessInfos = async (_req: Request, res: Response): Promise<void> => {
    try {
        const businessInfos = await BusinessInfo.find();
        res.status(200).json(businessInfos);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getBusinessInfoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const businessInfo = await BusinessInfo.findById(req.params.id);
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
        let { province, locality, distributor, address, establishment } = req.query;
        const filter: { [key: string]: any } = {};

        if (!province && !locality && !distributor && !address && !establishment) {
            const provinces = await BusinessInfo.aggregate([
                { $group: { _id: null, province: { $addToSet: "$province" } } },
                { $unwind: "$province" },
                { $sort: { province: 1 } }
            ]).exec();
            res.status(200).json(provinces.map(p => p.province));
            return;
        }

        if (province) {
            filter.province = province;

            if (!locality && !distributor && !address && !establishment) {
                const localities = await BusinessInfo.aggregate([
                    { $match: { province: province } },
                    { $group: { _id: null, locality: { $addToSet: "$locality" } } },
                    { $unwind: "$locality" },
                    { $sort: { locality: 1 } }
                ]).exec();
                res.status(200).json(localities.map(l => l.locality));
                return;
            }
        }

        if (locality && province) {
            filter.province = province;
            filter.locality = locality;

            if (!distributor && !address && !establishment) {
                const distributors = await BusinessInfo.aggregate([
                    { $match: { province: province, locality: locality } },
                    { $group: { _id: null, distributor: { $addToSet: "$distributor" } } },
                    { $unwind: "$distributor" },
                    { $sort: { distributor: 1 } }
                ]).exec();
                res.status(200).json(distributors.map(d => d.distributor));
                return;
            }
        }

        if (distributor && locality && province) {
            filter.province = province;
            filter.locality = locality;
            filter.distributor = distributor;

            if (!address && !establishment) {
                const addresses = await BusinessInfo.aggregate([
                    { $match: { province: province, locality: locality, distributor: distributor } },
                    { $group: { _id: null, address: { $addToSet: "$address" } } },
                    { $unwind: "$address" },
                    { $sort: { address: 1 } }
                ]).exec();
                res.status(200).json(addresses.map(a => a.address));
                return;
            }
        }

        if (address && distributor && locality && province) {
            filter.province = province;
            filter.locality = locality;
            filter.distributor = distributor;
            filter.address = address;

            if (!establishment) {
                const establishments = await BusinessInfo.aggregate([
                    { $match: { province: province, locality: locality, distributor: distributor, address: address } },
                    { $group: { _id: null, establishment: { $addToSet: "$establishment" } } },
                    { $unwind: "$establishment" },
                    { $sort: { establishment: 1 } }
                ]).exec();
                res.status(200).json(establishments.map(e => e.establishment));
                return;
            }
        }

        if ( address && distributor && locality && province && establishment) {
            filter.province = province;
            filter.locality = locality;
            filter.distributor = distributor;
            filter.address = address;
            filter.establishment = establishment;
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