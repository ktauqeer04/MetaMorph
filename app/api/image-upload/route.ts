import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@clerk/nextjs/server";

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

interface CloudinaryInterface{
    public_id: string,
    [key: string]: any
}

export async function POST(req: NextRequest){
    const {userId} = await auth();

    if(!userId){
        return NextResponse.json({
            error: "Unauthorized",
        },{
            status:400
        })
    }

    try{

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        // console.log(file?.name);
        
        if(!file){
            return NextResponse.json({
                error: "File Not found"
            },{
                status:400
            })
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryInterface>(
            (resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "cloudinary-image-uploads",                      
                        use_filename: true,
                        unique_filename:false
                    },(error, result) => {
                        if(error) reject(error);
                        else return resolve(result as CloudinaryInterface)
                    }
                ).end(buffer);
            }
        )
        //public_id -> cloudinary provides URL based string for viewing purposes
        console.log(result.public_id);
        

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