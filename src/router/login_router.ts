import  express  from "express";
import UserController from "../controller/user/user_controller";

const loginRouter = express.Router();

loginRouter.post("/login", UserController.login);
loginRouter.post("/signup", UserController.signUp);

export default loginRouter;