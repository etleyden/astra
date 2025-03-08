"use client";
import { FiPlusCircle } from "react-icons/fi";
import {useRef, useState} from "react";

interface UploadFilesProps {
    handleFile: (file: File) => void;
}
export default function UploadFiles({ handleFile }: UploadFilesProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files?.length) {
            // check if the name ends in csv
            if (!event.target.files[0].name.endsWith(".csv")) {
                // trigger an error
                return;
            }
            handleFile(event.target.files[0]);
        }
    }
    
    return (
        <>
            <h1 className="text-3xl text-center font-bold">Getting Started</h1>
            <div className="grid place-items-center mt-5 w-full">
                <label htmlFor="file-upload" className="btn btn-primary"><FiPlusCircle/> Upload some stuff.</label>
                <input 
                    type="file" 
                    id="file-upload" 
                    ref={fileInputRef} 
                    className="hidden"
                    onChange={handleUpload}/>
            </div>
        </>
    );
}