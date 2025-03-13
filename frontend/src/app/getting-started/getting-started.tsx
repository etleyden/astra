"use client";
import {useState} from "react";
import UploadFiles from "../../views/upload/upload";
import AnnotateFile from "@/views/upload/annotate";
import {GettingStartedSteps} from "../constants/enums";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function GettingStarted() {
    const [files, setFiles] = useState<AnnotatedFiles[]>([]);
    const [newestFile, setNewestFile] = useState<File | null>(null);
    const [step, setStep] = useState<GettingStartedSteps>(GettingStartedSteps.UPLOAD_FILES);
    const [user_annotation, setUserAnnotation] = useState<Annotation | null>(null);
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const handleNewFile = (file: File) => {
        // validate that the file is a valid file
        setNewestFile(file);
        nextStep();
    }
    const handleAnnotationResult = (result: Annotation | string | null, nextStep?: GettingStartedSteps) => {
        if (!result) { // annotation view returns null when the annotation action was aborted
            setNewestFile(null);
            prevStep();
        }
        if(result instanceof Annotation) {
            if(nextStep) {
                setStep(nextStep);
                setUserAnnotation(result);
            } else {
                throw new Error("No next step was given.");
            }
        } else {
            console.error(result);
            setNewestFile(null);
            prevStep();
        }
    }
    const handleAccountCreation = () => {
        // after account creation, go back to file annotation with the saved annotation
        console.log("Suck sess");
    }
    // we'll load a different page depending on which stage we're in, in the setup process.
    function renderStep() {
        switch(step) {
            case GettingStartedSteps.UPLOAD_FILES:
                return <UploadFiles handleFile={handleNewFile}/>;
                break;
            case GettingStartedSteps.ANNOTATE_FILES:
                if(!newestFile) {
                    console.error("Unexpected state: newestFile is null at the annotation step. ");
                    return null;
                }
                return <AnnotateFile annotationHandler={handleAnnotationResult} file={newestFile}/>
                break;
            default: 
                console.error(`Step is an unexpected value: ${step}. There is no step ${step}`);
                return null;
        }
    }

    return (
        <ProtectedRoute>
            <div className="m-10">
                {renderStep()}
            </div>
        </ProtectedRoute>
    );
}