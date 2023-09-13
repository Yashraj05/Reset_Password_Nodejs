import mongoose from "mongoose";
import { hash as _hash } from "bcrypt";
;
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await _hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});

export default mongoose.model("user", userSchema);
