import express from 'express';
import router from './routes/index';

const app = express();
app.use(express.json());
app.use(router);

console.log(process.env.DB_HOST);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
