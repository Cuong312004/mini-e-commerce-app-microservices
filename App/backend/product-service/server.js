import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import productRoute from './routes/productRoute.js';
import uploadRoute from './routes/uploadRoute.js';

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Product-Service DB connected'))
  .catch((err) => console.error(err));

const app = express();
app.use(bodyParser.json());
app.use('/api/products', productRoute);
app.use('/api/uploads', uploadRoute);

const PORT = config.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Product Service running at http://localhost:${PORT}`);
});
