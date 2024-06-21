import { Router } from 'express';
import { getAllRoleUsers, getRoleUserById, createRoleUser, updateRoleUser, deleteRoleUser } from '../controllers/role-user.controller';
const router: Router = Router();
router.get('/', getAllRoleUsers);
router.get('/:id', getRoleUserById);
router.post('/', createRoleUser);
router.put('/:id', updateRoleUser);
router.delete('/:id', deleteRoleUser);
export default router;