import express, { Request, Response } from "express";
import { AppDataSource ,init} from "./migration/data-source";
import { User } from "./entity/User";
import { Role } from "./entity/Role";
import { Permission } from "./entity/Permission";
import { DataSource } from 'typeorm';
import cors from "cors";
import permissionRouter from "./routes/Permission/permission.route";

const app = express();



// middlewares
app.use(express.json());
app.use(cors());


//routes
app.get("/", (req : Request, res : Response) => {
    res.send("It is about to get down!");
})

// app.post("/", (req : Request, res : Response) => {
//   const user = new User();
//   if(!req.body.firstName) {
//     res.status(400).send("firstName is required");
//   }

//   if(!req.body.lastName) {
//     res.status(400).send("lastName is required");
//   }

//   if(req.body.lastName === req.body.firstName) {
//     res.status(400).send("lastName cannot be the same as firstName");
//   }

//   if(!req.body.isActive) {
//     res.status(400).send("isActive is required");
//   }
    
//   user.firstName = req.body.firstName;
//   user.lastName = req.body.lastName;
//   user.isActive = req.body.isActive;
//   AppDataSource.manager.save(user);
//   res.status(201).send(user);    
// })
// })

// create new role
app.post("/roles", (req : Request, res : Response) => {
    const role = new Role();
    role.name = req.body.name;
    AppDataSource.manager.save(role);
    res.status(201).send({
        message: "Role created successfully",});
})

// get roles
app.get("/roles", async (req : Request, res : Response) => {
    const rolesData =[];
    const roles = await AppDataSource.getRepository(Role).find();
    for (const role of roles!) {
        rolesData.push(role);
    }
    res.status(200).json(roles);
})
    

// create to create persmission in bulk
app.use('/api/v1/permissions', permissionRouter);



export default app