import { Request, Response } from 'express';
import UserProfile from '../models/user-profile.model';
import bcrypt from 'bcrypt';
import RoleUser from '../models/role-user.model';

export const getAllUserProfiles = async (_req: Request, res: Response): Promise<void> => {
    try {
        const userProfiles = await UserProfile.find().populate('role');
        res.status(200).json(userProfiles);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getUserProfileById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userProfile = await UserProfile.findById(req.params.id).populate('role');
        if (userProfile) {
            res.status(200).json(userProfile);
        } else {
            res.status(404).json({ message: 'UserProfile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, lastName, email, password, roleName } = req.body;
        const role = await RoleUser.findOne({ rol: roleName });
        if (!role) {
            res.status(400).json({ message: 'Invalid role name' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserProfile = new UserProfile({
            name,
            lastName,
            email,
            password: hashedPassword,
            role: role._id,
        });

        const savedUserProfile = await newUserProfile.save();
        res.status(201).json(savedUserProfile);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUserProfile = await UserProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedUserProfile) {
            res.status(200).json(updatedUserProfile);
        } else {
            res.status(404).json({ message: 'UserProfile not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedUserProfile = await UserProfile.findByIdAndDelete(req.params.id);
        if (deletedUserProfile) {
            res.status(200).json({ message: 'UserProfile deleted' });
        } else {
            res.status(404).json({ message: 'UserProfile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error });
    }
};