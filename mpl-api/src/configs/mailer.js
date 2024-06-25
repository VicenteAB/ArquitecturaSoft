import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

const getAccessToken = async () => {
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  try {
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    throw error;
  }
};

const createTransporter = async () => {
  const accessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false // Permite certificados autofirmados
    }
  });
};

const transporter = await createTransporter();

export default transporter;
