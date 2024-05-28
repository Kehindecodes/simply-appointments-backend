import express from "express";
import { AppDataSource ,init} from "./migration/data-source";
import cors from "cors";

const app = express();


// middlewares
app.use(express.json());
app.use(cors());


//routes
app.get("/", (req, res) => {
    res.send("It is about to get down!");
})



export default app