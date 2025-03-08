import {useState, useEffect} from "react";
import { CSV_COLUMN_LABELS } from "@/constants";
import Papa from "papaparse";
import { FaArrowRight } from "react-icons/fa";

interface AnnotateFileProps {
    annotationHandler: (annotation: Annotation | null) => void;
    onError: (error: string) => void;
    file: File;
}
const annotationLabelMapping: { [key: string]: string } = {
    "Vendor": "txn_vendor",
    "Amount": "txn_amount",
    "Category": "txn_category",
    "Date": "txn_date",
    "Description": "txn_description"
}

export default function AnnotateFile({annotationHandler, onError, file}: AnnotateFileProps) {
    const [annotation, setAnnotation] = useState<Annotation>({
        acct_id: "",
        txn_description: "", // date
        txn_vendor: "", // vendor
        txn_date: "", // amount
        txn_amount: "", // description
        txn_category: "" // category
    });
    // this will keep track of the used column labels, to prevent duplicate (ex: can't have two 'date' columns)
    const [labeledColumns, setLabeledColumns] = useState<string[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<{[key: string]: string}[]>([]);

    const addLabeledColumn = (newCol: string) => { setLabeledColumns(prevCols => [...prevCols, newCol]); }
    const removeLabeledColumn = (column: string) => { setLabeledColumns((prevCols) => prevCols.filter((col) => col != column)); }
    const updateAnnotation = (updatedFields: Partial<Annotation>) => {
        setAnnotation(prevValues => ({
            ...prevValues,
            ...updatedFields,
        }));
    }
    useEffect(() => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<{[key: string]: string}>, file) => {
                if(results.meta.fields) {
                    setCsvHeaders(results.meta.fields);
                } else {
                    onError("Unable to determine file headers on uploaded CSV");
                }
                if(results.data) {
                    console.log(results.data);
                    setCsvData(results.data);
                }
            }
        });
    }, []);

    // handles updates to each column label select element
    const labelHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {

        e.target.parentElement?.setAttribute("data-tip", e.currentTarget.value);
        let columnName = e.target.getAttribute("name") || "";
        if(e.currentTarget.value != "unlabeled") {
            // highlight the select element as green and update the annotation
            e.target.classList.add("select-primary");
            updateAnnotation({
                [annotationLabelMapping[e.currentTarget.value]]: columnName
            });
            addLabeledColumn(e.currentTarget.value);
        } else {
            e.target.classList.remove("select-primary");
            // remove the column from the annotation object
            // find the field where the column is located, and remove it    
            for (const [key, value] of Object.entries(annotation)) {
                if(value === columnName) {
                    updateAnnotation({[key]: ""});
                    removeLabeledColumn(
                        Object.keys(annotationLabelMapping).find(
                            current_key => annotationLabelMapping[current_key] === key) || "");
                    break;
                }
            }
        }
    }
    // preview the file data in a table, with each column able to be checked with a checkbox.
    // select an account
    //date vendor type amount notes
    let keyCounter = 0;
    //test
    return (
        <div className="absolute inset-0 h-screen w-screen">
            <div className="flex mx-5 my-3">
                <h1 className="text-2xl font-bold inline">Label the important columns.</h1>
                {/* TODO: Implement account select interface */}
                <button className="mx-5 btn btn-primary btn-sm">Done <FaArrowRight /></button> {/* TODO: disable the button until all required labels are labeled */}
            </div>
            <div className="absolute max-h-screen bottom-0 inset-x-3 overflow-auto border border-base-content/5 rounded-box" style={{top: '3.5rem'}}>
                <table className="table table-xs table-zebra table-pin-rows w-full border-collapse " >
                    <thead>
                        <tr>
                            {/* header ==> the name of the column in the CSV */}
                            {csvHeaders.map((header: string) => (
                                <th key={header} className="min-w-32">
                                    <div className="tooltip tooltip-bottom" data-tip="unlabeled">
                                        <select
                                            className='mt-2 select select-sm'
                                            defaultValue="unlabeled"
                                            onChange={labelHandler}
                                            name={header}>
                                            <option key="unlabeled" value="unlabeled">unlabeled</option>
                                            {CSV_COLUMN_LABELS.map((label) => {
                                                // label ==> the name of the column used by the app 
                                                // render the option if it hasn't been selected yet OR if its been used for this column already.
                                                return (!labeledColumns.includes(label) || annotation[annotationLabelMapping[label] as keyof Annotation] === header)
                                                    ? <option key={label} value={label}>{label}</option> : null;
                                            })}
                                        </select>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvData.map((row: { [key: string]: string }) => (
                            <tr key={keyCounter++}>
                                {Object.entries(row).map(([key, value]) => (
                                    <td key={`${key}.${value}.${keyCounter++}`}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}