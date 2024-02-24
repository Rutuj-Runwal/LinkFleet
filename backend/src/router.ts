import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

router.post('/generateShortLink',async (req,res) => {
    const url:string = req.body.url;
    const short:string = req.body.short;
    //@ts-ignore
    console.log(req.user); // TODO: Add types for extending express request object!
    if(url){
        //@ts-ignore
        const data = await prisma.link.create({data:{originalUrl:url,shortUrl:short,belongsToOwner:req.user.id}});
        console.log(data);
        res.send(data);
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

router.post('/updateShortLink', async (req,res) => {
    const updatedUrl:string = req.body.url;
    const updatedShort:string = req.body.short;
    const id:number = req.body.linkId;
    try{
        const updates = await prisma.link.update({
            where:{
                linkId:id,
                //@ts-ignore
                belongsToOwner:req.user.id // TODO: Add types for extending express request object!
            },
            data:{
                originalUrl:updatedUrl,
                shortUrl:updatedShort
            }
        });
        res.send(updates);
    }catch{
        //@ts-ignore
        res.send({msg:`Not found for ${req.user.name}`})
    }
});

export default router;