// TODO: Share types between the frontend and backend
declare global {
    export class Annotation { // column names in a CSV representing critical components of a transaction
        acct_id: string;
        txn_description: string;
        txn_vendor: string;
        txn_date: string;
        txn_amount: string;
        txn_category: string;
    }
    // Coupled CSV files and their annotations from the user
    export interface AnnotatedFile {
        id: number,
        name: string,
        data: { [key: string]: string }[],
        file: File;
        annotation: Annotation;
    }
    // Accounts that are being tracked by Astral
    export interface TrackedAccount {
        id: number,
        name: string,
        description: string,
        type: string | number
    }
}

export { };
