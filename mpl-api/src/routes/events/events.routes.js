import { Router } from 'express';
import { createEvent, getEvents, getEventById, editEvent, deleteEvent } from '../../controllers/events/event.controller.js';
import { authRequired } from '../../configs/middleware.js'

const router = Router();

router.post('/events', authRequired, createEvent);
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id', authRequired, editEvent);
router.delete('/events/:id', authRequired, deleteEvent);


export default router;