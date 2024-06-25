import express from 'express';
import { port } from './configs/environments.js';
import { sequelize } from './configs/db.js';
import authRoutes from './routes/users/auth.routes.js';
import reviewRoutes from './routes/reviews/reviews.routes.js';
import eventRoutes from './routes/events/events.routes.js'; 
import User from './models/user.model.js';
import Event from './models/event.model.js';
import Review from './models/review.model.js';

// Configurar asociaciones entre modelos
Event.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Event, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });
Event.hasMany(Review, { foreignKey: 'event_id' });

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/reviews', reviewRoutes); // Ruta para las operaciones relacionadas con reseñas
app.use('/api', eventRoutes);      // Ruta para las operaciones relacionadas con eventos

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    return sequelize.sync(); 
  })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
