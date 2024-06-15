import express, { Request, Response } from "express";
import { AppDataSource ,init} from "./migration/data-source";
import { User } from "./entity/User";
import { DataSource } from 'typeorm';
import cors from "cors";

const app = express();


// middlewares
app.use(express.json());
app.use(cors());


//routes
app.get("/", (req : Request, res : Response) => {
    res.send("It is about to get down!");
})

app.post("/", (req : Request, res : Response) => {
  const user = new User();
  if(!req.body.firstName) {
    res.status(400).send("firstName is required");
  }

  if(!req.body.lastName) {
    res.status(400).send("lastName is required");
  }

  if(req.body.lastName === req.body.firstName) {
    res.status(400).send("lastName cannot be the same as firstName");
  }

  if(!req.body.isActive) {
    res.status(400).send("isActive is required");
  }
    
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.isActive = req.body.isActive;
  AppDataSource.manager.save(user);
  res.status(201).send(user);    
})



export default app