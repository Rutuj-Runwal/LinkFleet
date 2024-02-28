
import express,{Request,Response} from "express";
import router from "./router";
import * as dotenv from "dotenv";
import ejs from 'ejs';
import { protect } from "./modules/auth";
import { createUser, signInUser } from "./modules/user";
import prisma from "./db";
dotenv.config();

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views','./src/views/');

// User: Register or Login
// Once user logs in 
// "JWT"
// Options to create new shortlinks & view older shortlinks(On a different page - Saves unnecessary reads!).
// Statistics for created shortlinks: Count, Region(based on get request)
// Features:
// - Encryption: Landing page, have to enter a password to access the url
// - Custom landing page: Landing page to display before going to actual link (customizable??)
// - Add new shortlinks, delete earlier created links.
// - Add custom global alias to your links
// - Secure: Only you can view your links

app.get('/:link',async (req,res) => {
    const link = req.params['link'];
    const password = req.query['password'];
    if(link){
        try{
            const redirectionData = await prisma.link.findFirstOrThrow({
                where:{
                    shortUrl:link
                }
            });
            // Update statistics
            if(!password){
                if(redirectionData.trackStats){
                    const dt = new Date();
                    await prisma.linkStatistics.update({
                        where:{
                            belongsToLink:redirectionData.linkId,
                        },
                        data:{
                            visits:{
                                push:[dt.toISOString()]
                            }
                        }
                    });
                }
            }

            if(redirectionData.encrypt){
                if(!password){
                    res.render('enc', { link });
                    return;
                }else{
                    if(redirectionData.encPassword===password){
                        res.redirect(redirectionData.originalUrl);
                        return;
                    }else{
                        res.status(401).send({msg:'Invalid Access code!'});
                    }
                }
            }else{
                res.redirect(redirectionData.originalUrl);
            }
        }catch(e){
            res.status(404).send(e);
        }
        
    }
});

app.use('/signin',signInUser);
app.use('/register',createUser);

app.use('/api',protect,router);

app.listen(3000,()=>{console.log('Server running on 3000')});