import { NextFunction, Request, Response,Router } from "express";
import prisma from "./db";

const router = Router();

const checkShortLinkAvailability = async (req:Request,res:Response,next:NextFunction)  => {
    const shortToCheck:string = req.body.short;
    const url:string = req.body.url;
    const iDToUpdateOn:number = req.body.linkId;
    try{
        const check = await prisma.link.findFirstOrThrow({
            where:{
                shortUrl:shortToCheck
            }
        });
        if(check.linkId===iDToUpdateOn && check.originalUrl!=url){
            // If the user is only changing the original url.
            // Allow the change.
            next();
        }else{
            if(!check.encrypt){
                res.status(301).send({msg:'ShortLink already in use.',data:{url:check.originalUrl,shorthand:check.shortUrl}});
            }else{
                res.status(301).send({msg:'Shortlink already in use.Pick a different name'});
            }
            return;
        }
    }catch{
        // ShortLink is available to register or update
        next();
    }      
}

router.post('/generateShortLink',checkShortLinkAvailability,async (req,res) => {
    const url:string = req.body.url;
    const short:string = req.body.short;
    const encryptState:boolean = req.body.encryptState;
    const encryptionPass:boolean = req.body.encryptionPass || "";

    if(url){
        try{
            //@ts-ignore
            const data = await prisma.link.create({data:{originalUrl:url,shortUrl:short,belongsToOwner:req.user.id,encrypt:encryptState?true:false,encPassword: encryptionPass }});

            // Intialize empty statistics
            await prisma.linkStatistics.create({
                data:{
                    belongsToLink:data.linkId,
                    region:{
                        set:[]
                    },
                    visits:{
                        set:[]
                    }
                }
            });
            res.send(data);
        }catch(e){
            //@ts-ignore
            if(e.code==='P2002'){
                res.status(404).send({msg:`Url ${url} already exists with `});
            }
        }
    }
    return;
});

router.get('/getAllLinks',async (req,res)=>{
    const links = await prisma.user.findUnique({
        where:{
            //@ts-ignore
            id:req.user!.id
        },
        include:{
            link:true
        }
    });
    res.send({data:links});
    return;
});

router.post('/updateShortLink',checkShortLinkAvailability, async (req,res) => {
    const updatedUrl:string = req.body.url;
    const updatedShort:string = req.body.short;
    const id:number = req.body.linkId;
    const trackStatState:boolean = req.body.trackStats;
    const encryptState:boolean = req.body.encryptState;
    const encryptionPass:string = req.body.encryptionPass;

    try{
        const updates = await prisma.link.update({
            where:{
                linkId:id,
                //@ts-ignore
                belongsToOwner:req.user.id // TODO: Add types for extending express request object!
            },
            data:{
                originalUrl:updatedUrl,
                shortUrl:updatedShort,
                trackStats:trackStatState,
                encrypt:encryptState,
                encPassword:encryptionPass
            }
        });
        res.send(updates);
    }catch{
        //@ts-ignore
        res.send({msg:`Url not under ${req.user.name}'s administration`})
    }
});

router.post('/deleteShortLink', async (req,res) => {
    const id:number = req.body.linkId;
    // Check if user has access to domain
    try{
        const data = await prisma.link.findFirst({
            where:{
                linkId:id,
                //@ts-ignore
                belongsToOwner:req.user.id
            }
        });
        if(data!.linkId){
            // Remove statistics
            const stats = await prisma.linkStatistics.delete({
                where:{
                    belongsToLink:id
                }
            });
        
            const delItem = await prisma.link.delete({
                where:{
                    linkId:id,
                    //@ts-ignore
                    belongsToOwner:req.user.id
                }
            });
            res.send({msg:'Deletion Successful!',data:stats})
        }
    }catch{
        res.status(404).send({msg:'Not Authorized!'});
    }
})

export default router;