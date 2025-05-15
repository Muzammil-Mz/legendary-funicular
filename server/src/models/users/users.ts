import mongoose, { Schema, Document, Model } from "mongoose";

interface Iuser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  userVerified: {
    email: boolean | null;
  };
  userVerifyToken: {
    email: string |null
  };
}

const UserSchema = new Schema<Iuser>({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  userVerified: {
    email: {
      type: Boolean,
      default: false,
    },
  },
  userVerifyToken: {
    email: String,
  },
});

const userModel: Model<Iuser> = mongoose.model<Iuser>(
  "Users",
  UserSchema,
  "users"
);
export default userModel;
