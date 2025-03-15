/**
 * This will switch between showing the "Upload View" where you can manage multiple uploads and
 * "Annotation View" where you can manage the current file being uploaded. 
 */
import {useState} from "react";
import UploadFiles from "./UploadView";
import AnnotateFile from "./AnnotationView";


export const annotationLabelMapping: { [key: string]: string } = {
    "Vendor": "txn_vendor",
    "Amount": "txn_amount",
    "Category": "txn_category",
    "Date": "txn_date",
    "Description": "txn_description"
}

export default function UploadLayout() {
    const [files, setFiles] = useState<AnnotatedFile[]>([]);
    const [newestFile, setNewestFile] = useState<File | null>(null);
    const [newestAnnotation, setNewestAnnotation] = useState<AnnotatedFile | null>(null);
    const [isAnnotating, setIsAnnotating] = useState<boolean>(false);

    const handleNewFile = (file: File) => {
        // validate that the file is a valid file
        setNewestFile(file);
        // TODO: Consider parsing the CSV file here, so we don't have to parse it again between annotation and upload
        setIsAnnotating(true);
    }
    const handleAnnotationResult = (result: AnnotatedFile | string | null) => {
        if (!result) { // annotation view returns null when the annotation action was aborted
            setNewestFile(null);
            setIsAnnotating(false);
        }
        console.log(result);
        if(typeof result == 'string') {
            /** 
             * TODO: As of right now, there's no logic 
             * to resume a failed annotation. Investigate 
             * the case where this might happen and 
             * resume, ideally saving all annotation that a user has already done.
             */
            console.error(result);
            setNewestFile(null);
        } else {
            // NOTE: this is saved in case we need to resume this annotation later
            // as of right now, it's not used. 
            setNewestAnnotation(result);
            // =============
            // TODO: this is the part where we actually upload the users new data
            // =============
            // for now, we'll just store them locally and the user will actually lose their progress
            // afaik the most scalable solution for staging uploads are S3 buckets
            if(!result) {
                throw new Error("Something happned to your file in transit....");
            }
            setFiles([...files, result]);
        }
        setIsAnnotating(false);
    }

    if(isAnnotating) {
        if(!newestFile) {
            let message = "A logic error has occurred where we are annotating a file that doesn't exist."
            console.error(message);
            throw new Error(message)
        }
        return <AnnotateFile annotationHandler={handleAnnotationResult} file={newestFile}/>
    } else {
        return <UploadFiles handleFile={handleNewFile} uploadedFiles={files}/>
    }

}