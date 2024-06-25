import Review from '../../models/review.model.js';
import User from '../../models/user.model.js';
import Event from '../../models/event.model.js';

export const createReview = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const user_id  = req.user.id; 
    const { event_id } = req.params; 

    // Verificar si el evento existe
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Crear la reseña asociada al usuario y evento
    const review = await Review.create({ content, rating, user_id, event_id });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creando la reseña:', error);
    res.status(500).json({ message: 'Error al crear la reseña' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { event_id } = req.params; 

    // Obtener todas las reseñas asociadas al evento específico
    const reviews = await Review.findAll({
      where: { event_id },
      include: [
        { model: User, attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error obteniendo las reseñas:', error);
    res.status(500).json({ message: 'Error al obtener las reseñas' });
  }
};
