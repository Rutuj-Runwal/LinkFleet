import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import express,{Request,Response} from "express";
import jwt from 'jsonwebtoken';
dotenv.config();

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
var prisma = new PrismaClient();

// User: Register or Login
// Once user logs in 
// "JWT"
// Options to create new shortlinks & view older shortlinks(On a different page - Saves unnecessary reads!).
// Statistics for created shortlinks: Count, Region(based on get request)
// Features:
// - Encryption: Landing page, have to enter a password to access the url
// - Custom landing page: HTML page to display before going to actual link (customizable??)
// - Add new shortlinks, delete earlier created links.
// - Add custom global alias to your links
// - Secure: Only you can view your links

app.get('/test',(req:Request,res:Response) => {
    res.send('Hi!');
})

app.post('/register',async (req:Request,res:Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    console.log(password);

    // TODO: Vaildate all the data

    // Store the data into db
    const user = await prisma.user.create({data:{name:name,email:email,password:password}});

    // Generate a JWT
    const token = jwt.sign({name,password,id:user.id},"JWTsEcR@t",{expiresIn:'25d'});
    // TODO: Set token in localstorage via frontend
    console.log(token);
    res.send("Done!");
});

app.post('/login', async (req:Request,res:Response) => {
    // Check for JWT on bearer
    const bearer = req.headers.authorization;
    if(bearer){
        const token = bearer.split(" ")[1];
        try{
            const user = jwt.verify(token,"JWTsEcR@t",{ignoreExpiration:false});
            //@ts-ignore
            req.user = user;
            console.log('User details:');
            //@ts-ignore
            console.log(req.user);
            res.send(user);
        }catch(e){
            // console.log(e);
            res.status(404).send('No JWT found');
            // TODO: JWT is invalid, let user login using id pass
        }
    }else{
        // No JWT found, use id and password
        const email = req.body.email;
        const password = req.body.password;

        try{
            const user = await prisma.user.findFirstOrThrow({where:{email:email}});
            console.log(user);
            //@ts-ignore
            req.user = user;
            if(user.password===password){
                res.send(`Welcome Aboard ${user.name}`);
            }
            // Generate a JWT
            const token = jwt.sign({name:user.name,password:password,id:user.id},"JWTsEcR@t",{expiresIn:'25d'});
            // TODO: Set token in localstorage on frontend
            console.log(token);
        }catch{
            res.status(404).send({msg:"User not found! Register here: /register"});
        }
    }  
});

app.post('/api/generateShortLink',async (req:Request,res:Response) => {
    const url:string = req.body.url;
    const short:string = req.body.short;
    //@ts-ignore
    console.log(req.user);
    if(url){
        //@ts-ignore
        await prisma.link.create({data:{originalUrl:url,shortUrl:short,owner:req.user.id}});
    }
})

app.listen(3000,()=>{console.log('Server running on 3000')});