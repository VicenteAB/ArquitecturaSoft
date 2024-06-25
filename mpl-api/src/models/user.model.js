import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT
  },
  date_of_birth: {
    type: DataTypes.DATE
  },
  favorite_music_genre: {
    type: DataTypes.STRING
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  tableName: 'Users'
});

export default User;