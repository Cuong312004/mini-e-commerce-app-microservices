import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config.js';
import orderRoute from './routes/orderRoute.js';

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Order-Service DB connected'))
  .catch((err) => console.error(err));

const app = express();
app.use(bodyParser.json());
app.use('/api/orders', orderRoute);

const PORT = config.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Order Service running at http://localhost:${PORT}`);
});
