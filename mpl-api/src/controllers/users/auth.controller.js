import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import transporter from '../../configs/mailer.js';
import { v4 as uuidv4 } from 'uuid';

const createUser = async (req, res) => {
  const { name, email, password, address, date_of_birth, favorite_music_genre } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'La cuenta de usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      date_of_birth,
      favorite_music_genre,
      email_verified: false,
    });

    const verificationToken = uuidv4();
    const verificationUrl = `http://localhost:3000/auth/verify/${verificationToken}`;

    newUser.verificationToken = verificationToken;
    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verificación de cuenta de Music Place',
      html: `<p>Haga clic en el siguiente enlace para verificar su cuenta: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    });

    res.status(201).json({ message: 'Cuenta creada exitosamente. Compruebe su correo electrónico para verificar su cuenta.', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      if (!user.email_verified) {
        return res.status(403).json({ message: 'Cuenta no verificada' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña invalida' });
      }
  
      const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login exitoso', accessToken });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  };

  const me = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email', 'address', 'date_of_birth', 'favorite_music_genre', 'email_verified']
      });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
  };
  

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(400).json({ message: 'Token de verificación invalido' });
    }

    user.email_verified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada exitosamente.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Error al verificar la cuenta' });
  }
};

export { createUser, verifyEmail, login, me};
