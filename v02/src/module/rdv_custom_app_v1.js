import express from 'express';
import cors from 'cors';
import getUser from './rdv_app_v1_get_user.js';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/getuser', getUser);
