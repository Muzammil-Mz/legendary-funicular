import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import userModel from "../../models/users/users";

const router = express.Router();
router.get("/getall", async (req: Request, res: Response): Promise<void> => {
  try {
    let getall = await userModel.find({});
    res.status(StatusCodes.OK).json({ msg: getall });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }
});

router.get(
  "/getone/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      let id = req.params.id;
      let get = await userModel.findById(id);
      if (!get) {
        res.status(StatusCodes.NOT_FOUND);
        return;
      }
      res.status(StatusCodes.OK).json({ msg: get });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }
);

router.put(
  "/edituser/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      let { username, phone } = req.body;
      let params = req.params.id;
      const updateUser = await userModel.findByIdAndUpdate(
        params,
        { $set: { username, phone } },
        { new: true }
      );

      if (!updateUser) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "user not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ msg: "data updated successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
      }
    }
  }
);

router.delete(
  "/deleteone/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      let id = req.params.id;
      let deletee = await userModel.findByIdAndDelete(id);
      if (!deletee) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "cant delete user" });
      }
      res.status(StatusCodes.OK).json({ msg: "deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return;
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }
);

router.delete(
  "/deleteall",
  async (req: Request, res: Response): Promise<void> => {
    try {
      let deleteall = await userModel.deleteMany({});
      if (!deleteall) {
        res
          .status(StatusCodes.BAD_GATEWAY)
          .json({ msg: "error deleted ihhdn" });
        return;
      }
      res.status(StatusCodes.OK).json({msg:"doneeeeeeeeeeeeeee"})
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
      }
    }
  }
);

export default router;
