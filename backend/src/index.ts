
import express,{Request,Response} from "express";
import router from "./router";
import * as dotenv from "dotenv";
import { protect } from "./modules/auth";
import { createUser, signInUser } from "./modules/user";
dotenv.config();

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

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
});

app.use('/signin',signInUser);
app.use('/register',createUser);

app.use('/api',protect,router);

app.listen(3000,()=>{console.log('Server running on 3000')});