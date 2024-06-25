import express from 'express';
import { createReview, getReviews } from '../../controllers/reviews/reviews.controller.js';
import { authRequired } from '../../configs/middleware.js';

const router = express.Router();

// Ruta para crear una reseña asociada a un evento específico
router.post('/events/:event_id/reviews', authRequired, createReview);

// Ruta para obtener todas las reseñas de un evento específico
router.get('/events/:event_id/reviews', authRequired, getReviews);

export default router;
