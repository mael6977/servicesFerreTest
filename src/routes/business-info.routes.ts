import { Router } from 'express';
import {
    getBusinessInfos,
    getBusinessInfoById,
    getBusinessInfoBySearch,
    createBusinessInfo,
    updateBusinessInfo,
    deleteBusinessInfo,
} from '../controllers/business-info.controller';
const router = Router();
router.get('/search', getBusinessInfoBySearch);
router.get('/', getBusinessInfos);
router.get('/:id', getBusinessInfoById);
router.post('/', createBusinessInfo);
router.put('/:id', updateBusinessInfo);
router.delete('/:id', deleteBusinessInfo);
export default router;