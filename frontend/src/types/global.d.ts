declare global {
    export interface Annotation { // column names in a CSV representing critical components of a transaction
        acct_id: string;
        txn_description: string;
        txn_vendor: string;
        txn_date: string;
        txn_amount: string;
        txn_category: string;
    }
    export interface AnnotatedFiles {
        file: File;
        annotations: Annotation;
    }
}

export { };
