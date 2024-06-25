import Event from '../../models/event.model.js';
import User from '../../models/user.model.js';

const createEvent = async (req, res) => {
  try {
    const { title, description, music_genre, address, coordinates, total_rating } = req.body;
    const user_id = req.user.id;

    const event = await Event.create({ title, user_id, description, music_genre, address, coordinates, total_rating });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ 
      include: [{ 
        model: User,
        attributes: { exclude: ['password', 'email_verified', 'verificationToken', 'email'] } 
      }] 
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId, {
      include: [{
        model: User,
        attributes: { exclude: ['password', 'email_verified', 'verificationToken', 'email'] }
      }]
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (event.user_id !== userId) {
      return res.status(403).json({ error: 'No estás autorizado para editar este evento' });
    }

    const { title, description, music_genre, address, coordinates, total_rating } = req.body;
    await event.update({ title, description, music_genre, address, coordinates, total_rating });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (event.user_id !== userId) {
      return res.status(403).json({ error: 'No estás autorizado para eliminar este evento' });
    }

    await event.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createEvent, getEvents, getEventById, editEvent, deleteEvent };