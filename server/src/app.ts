import express, { Request, Response, Application } from "express";
import config from "config";
import userPublic from "./controllers/public/index";
import userRouter from "./controllers/private/users";
import authMiddleware from "./middlewares/auth";
import "./utils/dbConnect";
import { StatusCodes } from "http-status-codes";
import "./utils/dbConnect";

const app: Application = express();
const PORT: string = config.get<string>("PORT");
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(StatusCodes.OK).json({ msg: "hello" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
  }
});

app.use("/api/users/", userPublic);

app.use("/api/private/users", authMiddleware, userRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running ${PORT}`);
});
