"use client";
import {useState} from "react";
import UploadFiles from "./upload";
import AnnotateFile from "./annotate";



export default function GettingStarted() {
    const [files, setFiles] = useState<AnnotatedFiles[]>([]);
    const [newestFile, setNewestFile] = useState<File | null>(null);
    const [step, setStep] = useState(0);
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const handleNewFile = (file: File) => {
        setNewestFile(file);
        nextStep();
    }
    const handleNewAnnotations = (annotation: Annotation | null) => {
        if(!annotation) {
            setNewestFile(null);
            prevStep();
        }
    }
    const handleAnnotationError = (error: string) => {
        console.error(error);
        setNewestFile(null);
        prevStep();
    }
    // we'll load a different page depending on which stage we're in, in the setup process.
    function renderStep() {
        switch(step) {
            case 0:
                return <UploadFiles handleFile={handleNewFile}/>;
                break;
            case 1:
                if(!newestFile) {
                    console.error("Unexpected state: newestFile is null at the annotation step. ");
                    return null;
                }
                return <AnnotateFile annotationHandler={handleNewAnnotations} onError={handleAnnotationError} file={newestFile}/>
                break;
            default: 
                console.error(`Step is an unexpected value: ${step}. There is no step ${step}`);
                return null;
        }
    }

    return (
        <div className="m-10">
            {renderStep()}
        </div>
    );
}