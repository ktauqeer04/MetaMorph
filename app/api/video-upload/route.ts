import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

interface CloudinaryInterface{
    public_id: string,
    bytes: number,
    duration?: number,
    [key: string]: any
}

export async function POST(req: NextRequest){

    try{

        const {userId} = await auth();
        // console.log(`Workking`);
        

        if(!userId){
            return NextResponse.json({
                error: "Unauthorized",
            },{
                status:400
            })
        }

        const formData = await req.formData();
        // console.log(formData);
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        // console.log(`Workking 1`);

        if(!file){
            return NextResponse.json({
                error: "File Not found"
            },{
                status:400
            })
        }

        // console.log(`Workking 2`);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryInterface>(
            (resolve, reject) => {
                const upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "cloudinary-image-uploads",
                        resource_type: "video",
                        transformation: [
                            {quality: "auto", fetch_format:"mp4"}
                        ]
                    },(error, result) => {
                        if(error){ 
                            reject(error); console.log(`Error is here`);
                        }
                        else resolve(result as CloudinaryInterface)
                    }
                )
                upload_stream.end(buffer);
            }
        )

        const video = await prisma.video.create({
            data:{
                title,
                description,
                publicId: result.public_id,
                originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })

        console.log(video.title);
        

        return NextResponse.json({
            publicId: result.public_id
        }, {
            status:200
        })


    }catch(error){
        return NextResponse.json({
            error: "Something went Wrong"
        }, {
            status: 500
        })
    }

}