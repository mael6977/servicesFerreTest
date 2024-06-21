import { Router } from 'express';
import {
    createAudit,
    getAudits,
    getAuditById,
    updateAudit,
    deleteAudit
} from '../controllers/audit.controller';
const router: Router = Router();
router.get('/', getAudits);
router.get('/:id', getAuditById);
router.post('/', createAudit);
router.put('/:id', updateAudit);
router.delete('/:id', deleteAudit);
export default router;