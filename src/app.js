import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    //(this app.use is generlly come into use with middleware)
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //accept json in express app.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // here we config to get data from URL.
app.use(express.static("public")); // we config to store file,pdf or images into public folder.
app.use(cookieParser()); //to perform CRED operations in user browser.

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
//(here we have used ".use" middleware instead of ".get" as earlier we were writting all the routes and controller within the same file. whenever we type /users then control goes to userRouter)
app.use("/api/v1/users", userRouter);

export { app };
