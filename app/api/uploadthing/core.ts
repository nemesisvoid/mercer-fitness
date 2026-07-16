import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();



export const ourFileRouter = {
    imageUploader:f({
        image:{maxFileSize:"4MB" ,maxFileCount:1}
    }).middleware(async({req})=>{

        const user  = await auth.api.getSession({
            headers:req.headers
        })

        if(!user?.user.id) throw new Error("Unauthorized")
        return{userId:user.user.id, classId:req.headers.get('x-class-i')??''}
    }).onUploadComplete(async({metadata, file})=>{

        if (metadata.classId) {
            await prisma.class.update({
                where:{
                    id:metadata.classId
                },
                data:{
                    image:file.ufsUrl
                }
            })
        }


        return {fileUrl:file.ufsUrl}
        
    })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

