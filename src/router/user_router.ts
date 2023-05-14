import  express  from "express";
import UserController from "../controller/user/user_controller";
import { verifyAuth } from "../middleware/verify_auth";
import { upload } from "../util/multer";

const userRouter = express.Router();

userRouter.post("/avatar", verifyAuth, upload.single("avatars"), UserController.addAvatar);

export default userRouter;
