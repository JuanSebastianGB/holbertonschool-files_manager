import express from 'express';
import router from './routes/index';

require('dotenv').config();

const app = express();
router(app);

console.log(process.env.DB_HOST);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
