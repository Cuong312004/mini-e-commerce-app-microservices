import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import userRoute from './routes/userRoute.js';

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Auth-Service DB connected'))
  .catch((err) => console.error(err));

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoute);

const PORT = config.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth Service running at http://localhost:${PORT}`);
});
