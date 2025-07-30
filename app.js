import express, { json } from 'express';
const app = express();
app.use(json());

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/user'));

export default app;