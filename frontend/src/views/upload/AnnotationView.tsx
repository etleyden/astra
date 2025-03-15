/**
 * This is the view where users can label columns on a CSV that they have uploaded
 */
import {useState, useEffect} from "react";
import { useAuth } from "@/context/AuthContext";
import { CSV_COLUMN_LABELS } from "@/constants";
import Papa from "papaparse";
import { FaArrowRight } from "react-icons/fa";
import CreateAccount from "@/components/CreateAccount";
import DialogPopup from "@/components/DialogPopup";
import { annotationLabelMapping } from "./UploadLayout";

interface AnnotateFileProps {
    annotationHandler: (result: AnnotatedFile | string | null) => void; // package the annotation with the new file
    file: File; // the file we're annotating
    user_annotation?: Annotation // a user annotation in the case where we are resuming a failed annotation
}


const getTrackedAccounts = async (token: string | null): Promise<TrackedAccount[]> => {
    // Retrieve the user's list of tracked accounts
    let result = await fetch("http://localhost:3001/api/user/accounts",
        {
            headers: { "Authorization": `Bearer ${token}` },
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            let userTrackedAccounts: TrackedAccount[] = [];
            data.map((row: TrackedAccount) => {
                userTrackedAccounts.push({
                    id: row.id,
                    name: row.name,
                    description: "",
                    type: -1
                });
            });
            return userTrackedAccounts;
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    return result;
}
export default function AnnotateFile({ annotationHandler, file, user_annotation }: AnnotateFileProps) {
    const { getToken } = useAuth();
    const [annotation, setAnnotation] = useState<Annotation>((user_annotation) ? user_annotation :
        {
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
    const [csvData, setCsvData] = useState<{ [key: string]: string }[]>([]);
    const [createAccountPopup, setCreateAccountPopup] = useState<boolean>(false);
    const [trackedAccounts, setTrackedAccounts] = useState<TrackedAccount[]>([]);
    // used to automatically select an account if the user created it just now
    const [selectedTrackedAccount, setSelectedTrackedAccount] = useState<TrackedAccount>({
        id: -1, description: "", type: "",
        name: "select_account"
    });

    const addLabeledColumn = (newCol: string) => { setLabeledColumns(prevCols => [...prevCols, newCol]); }
    const removeLabeledColumn = (column: string) => { setLabeledColumns((prevCols) => prevCols.filter((col) => col != column)); }
    const updateAnnotation = (updatedFields: Partial<Annotation>) => {
        setAnnotation(prevValues => ({
            ...prevValues,
            ...updatedFields,
        }));
    }


    useEffect(() => {
        // parse the given CSV file
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<{ [key: string]: string }>, file) => {
                if (results.meta.fields) {
                    setCsvHeaders(results.meta.fields);
                } else {
                    annotationHandler("Unable to determine file headers on uploaded CSV");
                }
                if (results.data) {
                    setCsvData(results.data);
                }
            }
        });
        // TODO: Automatically detect most probable annotation and fill it out for the user
        getTrackedAccounts(getToken()).then((accounts) => {
            setTrackedAccounts(accounts);
        }).catch((err) => { console.error(err); throw err; })
    }, []);

    // handles updates to each column label select element
    const labelHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {

        e.target.parentElement?.setAttribute("data-tip", e.currentTarget.value);
        let columnName = e.target.getAttribute("name") || "";
        if (e.currentTarget.value != "unlabeled") {
            // highlight the select element as green and update the annotation
            e.target.classList.add("select-primary");
            // check if there is already a value in annotation with this column name, and then remove it
            for(const [k, v] of Object.entries(annotation)) {
                if(v == columnName) {
                    updateAnnotation({[k]: ""});
                    // find if annotationLabelMapping[k] is in 
                    removeLabeledColumn(Object.keys(annotationLabelMapping).find(
                        current_key => annotationLabelMapping[current_key] === k) || "");
                }
            }
            updateAnnotation({
                [annotationLabelMapping[e.currentTarget.value]]: columnName
            });
            addLabeledColumn(e.currentTarget.value);
            // TODO remove labeled column in the case where we're switching from something labeled to a different label
        } else {
            e.target.classList.remove("select-primary");
            // remove the column from the annotation object
            // find the field where the column is located, and remove it    
            for (const [key, value] of Object.entries(annotation)) {
                if (value === columnName) {
                    updateAnnotation({ [key]: "" });
                    removeLabeledColumn(
                        Object.keys(annotationLabelMapping).find(
                            current_key => annotationLabelMapping[current_key] === key) || "");
                    break;
                }
            }
        }
    }

    const accountSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.currentTarget.value == "add_account") {
            setCreateAccountPopup(true);
        } else {
            setCreateAccountPopup(false)
            for(let i in trackedAccounts) {
                if(trackedAccounts[i].name == e.currentTarget.value) {
                    setSelectedTrackedAccount(trackedAccounts[i]);
                    setAnnotation({
                        ...annotation,
                        acct_id: trackedAccounts[i].id.toString()
                    })
                    break;
                }
            }
        }
    }

    const accountCreationHandler = (new_account: TrackedAccount) => {
        setTrackedAccounts([
            ...trackedAccounts,
            new_account
        ]);
        setSelectedTrackedAccount(new_account);
        setAnnotation({
            ...annotation,
            acct_id: new_account.id.toString()
        })
        setCreateAccountPopup(false);
    }
    // preview the file data in a table, with each column able to be checked with a checkbox.
    // select an account
    //date vendor type amount notes
    let keyCounter = 0;
    return (
        <>
            <div className="absolute inset-0 h-screen w-screen">
                <div className="flex mx-5 my-3">
                    <h1 className="text-2xl font-bold inline me-3">Label the important columns.</h1>
                    <select
                        className="select select-sm mx-3 w-fit"
                        value={selectedTrackedAccount.name}
                        onChange={accountSelectHandler}>
                        <option key="select_account" value="select_account">select account</option>
                        {trackedAccounts.map((tracked_account) => {
                            return (
                                <option key={tracked_account.name} value={tracked_account.name}>{tracked_account.name}</option>
                            );
                        })}
                        <option key="add_account" value="add_account">Add Account</option>
                    </select>
                    <button 
                        className={
                            `mx-3 btn btn-primary btn-sm 
                            ${(labeledColumns.length === CSV_COLUMN_LABELS.length && 
                                selectedTrackedAccount.name !== "select_account") 
                                ? "" : "btn-disabled"}`}
                        onClick={() => annotationHandler({
                            id: -1, // implement this later
                            name: file.name,
                            data: csvData,
                            file: file,
                            annotation: annotation
                        })}>Done <FaArrowRight /></button>
                </div>
                <div className="absolute max-h-screen bottom-0 inset-x-3 overflow-auto border border-base-content/5 rounded-box" style={{ top: '3.5rem' }}>
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
            {/* TODO: implement data flow from the CreateAccount to get the data resulting from the account creation step*/}
            <DialogPopup dialogIsOpen={createAccountPopup}>
                <CreateAccount accountCreationHandler={accountCreationHandler} />
            </DialogPopup>
        </>
    )
}