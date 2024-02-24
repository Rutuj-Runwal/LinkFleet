import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { createJWT } from "./auth";

export const createUser = async (req:any,res:any) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    // TODO: Vaildate all the data


    // Store the data into db
    const user = await prisma.user.create({data:{name:name,email:email,password:password}});

    // Generate a JWT
    const token = createJWT(user);
    // TODO: Set token in localstorage via frontend
    console.log(token);
    res.status(200).json({ token: token });
    return;
}

export const signInUser = async (req:any,res:any) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await prisma.user.findFirstOrThrow({where:{email:email}});
        //@ts-ignore
        req.user = user;
        console.log(user.password===password);
        if(user.password===password){
            // Generate a JWT
            const token = createJWT(user);
            // TODO: Set token in localstorage on frontend
            console.log(token);
            res.status(200).json({ token: token, message: `Welcome Aboard ${user.name}`});
        }else{
            res.status(402).send('Invalid Password!');
            return;
        }
       
    }catch{
        res.status(404).send({msg:"User not found! Register here: /register"});
    }  
}