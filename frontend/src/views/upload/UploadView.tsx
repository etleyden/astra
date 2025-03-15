"use client";
import { FiPlusCircle } from "react-icons/fi";
import {useRef, useState} from "react";
import { annotationLabelMapping } from "./UploadLayout";

interface UploadFilesProps {
    handleFile: (file: File) => void; // handle a new upload
    uploadedFiles: AnnotatedFile[]; // staged uploads
}
export default function UploadFiles({ handleFile, uploadedFiles = []}: UploadFilesProps) {
    const [files, setFiles] = useState<AnnotatedFile[]>(uploadedFiles);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files?.length) {
            // check if the name ends in csv
            // TODO: perform a more robust CSV validation. 
            if (!event.target.files[0].name.endsWith(".csv")) {
                // trigger an error
                return;
            }
            handleFile(event.target.files[0]);
        }
    }
    
    return (
        <div className="m-5">
            <h1 className="text-3xl text-center font-bold">Getting Started</h1>
            {/* Iterate through all the current files and display a synopsis of the annotation */}
            {files.map((annotatedFile) => {
                return (
                    <div>
                        {annotatedFile.name}
                    </div>);
            })}
            <div className="grid place-items-center mt-5 w-full">
                <label htmlFor="file-upload" className="btn btn-primary"><FiPlusCircle/> Upload some stuff.</label>
                <input 
                    type="file" 
                    id="file-upload" 
                    ref={fileInputRef} 
                    className="hidden"
                    onChange={handleUpload}/>
            </div>
        </div>
    );
}