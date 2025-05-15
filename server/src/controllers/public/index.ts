import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import jwt from "jsonwebtoken";
import userModel from "../../models/users/users";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

import sendEmail from "../../utils/EmailConnect";

const router = express.Router();

const JWT_key: string = config.get<string>("JWT_KEY");
const URL: string = config.get<string>("URL");
const USER: string = config.get<string>("EMAIL");

router.post("/register", async (req: Request, res: Response) => {
  try {
    console.log("Received body:", req.body); // ← Add this line
    let { username, email, password, phone } = req.body;
    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);
    console.log("phone:", phone);

    if (!username || !email || !password || !phone) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "please all fiedls required" });
      return;
    }

    let userExist = await userModel.findOne({ username });
    if (userExist) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "email already exists please try anothe mail" });
      return;
    }

    let hashpass = await bcrypt.hash(password, 10);

    let emailToken = Math.random().toString(36).substring(2);
    let newUser = {
      username,
      password: hashpass,
      email,
      phone,
      userVerifyToken: {
        email: emailToken,
      },
    };

    await userModel.create(newUser);

    const emailData = {
      from: USER,
      to: email,
      subject: "verfication Link",
      html: `<p>${URL}/api/users/emailverify/${emailToken}</p>`,
    };

    await sendEmail(emailData);
    console.log(`${URL}/api/public/emailverify/${emailToken}`);
    res.status(StatusCodes.OK).json({
      msg: "email verification link sent successfully confirm to login",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }
});

router.get(
  "/emailverify/:token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      let {token} = req.params;
      console.log(token);
      const user = await userModel.findOne({ "userVerifyToken.email": token });
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid token" });
        return;
      }

      if (user.userVerified.email == true) {
        res.status(StatusCodes.OK).json({ msg: "user mail verified already" });
        return;
      }

      user.userVerified.email = true;
      user.userVerifyToken.email = null;
      await user.save();

      res.status(200).json({ msg: "mail verifed successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
      }
    }
  }
);

router.post("/login", async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "please fill both" });
      return;
    }

    let user = await userModel.findOne({ email });
    if (!user) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "no user found" });
      return;
    }

    let passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "invalid password" });
      return;
    }

    let token = jwt.sign({ id: user._id }, JWT_key, { expiresIn: "5h" });
    res
      .status(StatusCodes.ACCEPTED)
      .json({ msg: "user logged in successfully", token });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  }
});

router.post("/resetpassword", async (req: Request, res: Response) => {
  try {
    let { email } = req.body;
    let checkUser = await userModel.findOne({ email });
    if (!checkUser) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "no user found" });
      return;
    }

    let newPass = crypto.randomBytes(8).toString("hex");
    let hashedpass = await bcrypt.hash(newPass, 10);

    checkUser.password = hashedpass;
    await checkUser.save();

    const emailData = {
      from: USER,
      to: email,
      subject: "forgot password",
      text: `new password is ${newPass}`,
    };

    await sendEmail(emailData);
    res.status(StatusCodes.OK).json({ msg: "new password sent to email" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
});

export default router;
