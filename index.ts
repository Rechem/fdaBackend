import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import loginRouter from './src/router/login_router';
import mealRouter from './src/router/meal_router';
import orderRouter from './src/router/order_router';
import restaurantRouter from './src/router/restaurant_router';
import userRouter from './src/router/user_router';
import { errorHandler } from './src/handler/error_handler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

export const filesPrefix = "uploads/"

app.use('/' + filesPrefix, express.static('public'));

app.use('/', loginRouter)
app.use('/meals', mealRouter)
app.use('/orders', orderRouter)
app.use('/restaurants', restaurantRouter)
app.use('/user', userRouter)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});