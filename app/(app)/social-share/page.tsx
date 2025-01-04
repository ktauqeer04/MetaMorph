"use client"
import React, {useEffect, useRef, useState} from 'react'
import { CldImage } from 'next-cloudinary';
 
const socialMediaDimensions = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialMediaDimensions;

function SocialShare() {

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if(uploadedImage){
       setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if(!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try{
      const response = await fetch('/api/image-upload', {
        method: "POST",
        body: formData
      })

      if(!response.ok){
        throw new Error('Failed to Upload Image')
      }

      const data = await response.json();

      // console.log(`id is -> ${data.publicId}`);
      
      setUploadedImage(data.publicId);


    }catch(error){

      console.error(error);
      alert('Failed To Upload Image');

    }finally{
      setIsUploading(false);
    }

  }

  const handleDownload = () => {

    if(!imageRef.current){
      return;
    }

    fetch(imageRef.current.src)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })  

  }

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Customize Your Image
      </h1>
      
      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
        <h2 className="text-xl font-medium mb-4 text-gray-700">Upload an Image</h2>
        <div className="form-control">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Choose an image file
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 focus:outline-none p-2"
          />
        </div>
  
          {isUploading && (
            <div className="mt-6 flex justify-center items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black border-opacity-75"></div>
              <div className="text-lg font-bold text-black tracking-wide">
                Loading...
              </div>
            </div>
          </div>          

          )}
  
          {uploadedImage && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Select Social Media Format</h2>
              <div className="form-control mb-6">
                <select
                  className="select select-bordered w-full text-gray-700"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
                >
                  {Object.keys(socialMediaDimensions).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="mt-6 relative bg-gray-200 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview:</h3>
                <div className="flex justify-center relative">
                  {isTransforming && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-75 mb-4"></div>
                      <div className="text-white text-lg font-semibold">Transforming Image</div>
                    </div>
                  )}

                  <CldImage
                    width={socialMediaDimensions[selectedFormat].width}
                    height={socialMediaDimensions[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="Transformed Image"
                    crop="fill"
                    aspectRatio={socialMediaDimensions[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>
  
              <div className="flex justify-center mt-8">
                <button
                  className="btn btn-lg bg-gray-800 text-white font-medium px-6 py-3 rounded-md shadow-sm hover:bg-gray-700 transition-colors"
                  onClick={handleDownload}
                >
                  Download for {selectedFormat}
                </button>
              </div>

            </div>
          )}
        </div>
    </div>
  );
  
}

export default SocialShare
