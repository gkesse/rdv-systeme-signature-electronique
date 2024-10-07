import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadFile from './rdv_app_upload_file.js';
import saveSubscription from './rdv_app_save_subscription.js';
import saveInvoice from './rdv_app_save_invoice.js';
import savePayments from './rdv_app_save_payment.js';
import gooogleauth from './rdv_app_google_auth.js';
import autoReminder from './rdv_app_send_reminder.js';

export const app = express();

dotenv.config();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.post('/file_upload', uploadFile);
app.post('/savesubscription', saveSubscription);
app.post('/saveinvoice', saveInvoice);
app.post('/savepayment', savePayments);
app.post('/googleauth', gooogleauth);
app.post('/sendreminder', autoReminder);
