import { Router } from 'express';
import { getAllTours, deleteTour, saveTour, updateTour, getById, } from '../controllers/tourController.js';
const router = Router();
router.route('/').get(getAllTours).post(saveTour);
router.route('/:id').put(updateTour).delete(deleteTour).get(getById);
export { router };
//# sourceMappingURL=tourRoute.js.map