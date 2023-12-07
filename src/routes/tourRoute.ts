import { Router } from 'express';
import {
  getAllTours,
  deleteTour,
  saveTour,
  updateTour,
  getById,
  getTourStats,
  getTourMonthlyPlan,
} from '../controllers/tourController.js';
import { protect, restrictToRole } from '../controllers/authController.js';

const router = Router();

router.route('/').get(protect, getAllTours).post(saveTour);
router.route('/stats').get(getTourStats);
router.route('/monthlyPlan/:year').get(getTourMonthlyPlan);
router
  .route('/:id')
  .put(updateTour)
  .delete(protect, restrictToRole(['admin', 'lead-guide']), deleteTour)
  .get(getById);

export { router };
