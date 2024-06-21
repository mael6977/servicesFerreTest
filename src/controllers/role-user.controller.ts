import { Request, Response } from 'express';
import RoleUser from '../models/role-user.model';

export const getAllRoleUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const roleUsers = await RoleUser.find();
        res.status(200).json(roleUsers);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getRoleUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const roleUser = await RoleUser.findById(req.params.id);
        if (roleUser) {
            res.status(200).json(roleUser);
        } else {
            res.status(404).json({ message: 'RoleUser not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error  });
    }
};

export const createRoleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newRoleUser = new RoleUser(req.body);
        const savedRoleUser = await newRoleUser.save();
        res.status(201).json(savedRoleUser);
    } catch (error) {
        res.status(400).json({ message: error  });
    }
};

export const updateRoleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedRoleUser = await RoleUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedRoleUser) {
            res.status(200).json(updatedRoleUser);
        } else {
            res.status(404).json({ message: 'RoleUser not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error  });
    }
};

export const deleteRoleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedRoleUser = await RoleUser.findByIdAndDelete(req.params.id);
        if (deletedRoleUser) {
            res.status(200).json({ message: 'RoleUser deleted' });
        } else {
            res.status(404).json({ message: 'RoleUser not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error  });
    }
};