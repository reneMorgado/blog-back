import express from 'express';
import morgan from 'morgan';

import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import commentsRoutes from './routes/comments.js';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.set('port', process.env.PORT);

app.use(morgan('dev'));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }));
  
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API RESTful de Blog' });
})

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${app.get('port')}`);
});