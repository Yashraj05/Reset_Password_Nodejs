import dotenv from 'dotenv'
import mongoose  from "mongoose";
dotenv.config({path:"/home/my/Desktop/forgotpassword/.env.example"})
let DB_URL = process.env.DB_URL;


export default async function connection() {
  console.log(DB_URL)
  try {
    await mongoose.connect(
      DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
      },
      (error) => {
        if (error) return new Error("Failed to connect to database");
        console.log("connected");
      }
    );
  } catch (error) {
    console.log(error);
  }
};
