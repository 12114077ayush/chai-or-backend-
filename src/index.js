// require('dotenv').config({path: './env'})
import { app } from "./app.js";
import dotenv from "dotenv";          
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" })    


connectDB()
.then(() => {

    app.on("error", (error) => {
       console.log("ERRR:",error);
   })
   
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    })
})
.catch((error) => {
    console.log("MongoDb connection failed !!!",error);
})




/*
import express from express;
const app = express();

; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log(error);
        })
       
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.log(error);
    }
})();
*/