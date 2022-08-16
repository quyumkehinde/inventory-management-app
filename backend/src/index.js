import config from './config.js';
import routes from './routes.js';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors())

app.use('/api/v1/', routes);

app.listen(config.APP_PORT || 3200, () =>
    console.log('Server running!'),
);
