import mongoose, { Document, Schema, Model } from "mongoose";
import { stringify } from "node:querystring";

interface IFreelancers extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  isVerified: {
    email: boolean | null;
  };
  isVerifyToken: {
    email: string | null;
  };
}

const freelanceSchema = new Schema<IFreelancers>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
  },
  isVerified: {
    email: {
      default: false,
      type: Boolean,
    },
  },
  isVerifyToken: {
    email: String,
  },
});


const freelanceModel:Model<IFreelancers>= mongoose.model("Freelancers",freelanceSchema,"freelancers")