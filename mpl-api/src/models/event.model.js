import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';
import User from './user.model.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  music_genre: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  coordinates: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  total_rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  }
}, {
  tableName: 'Events'
});

Event.belongsTo(User, { foreignKey: 'user_id' });

export default Event;