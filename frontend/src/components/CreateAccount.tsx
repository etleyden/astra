import {useState, useEffect} from "react";
import {useAuth} from "@/context/AuthContext";

interface AccountType {
    id: number,
    name: string
}

interface CreateAccountProps {
    accountCreationHandler: (new_account: TrackedAccount) => void;
}
export default function CreateAccount({accountCreationHandler}: CreateAccountProps) {
    const {getToken} = useAuth();
    const [trackedAccount, setTrackedAccount] = useState<TrackedAccount>({
        id: -1,
        name: "",
        description: "",
        type: ""
    });
    const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

    useEffect(() => {
        // get the list of account types from the db
        fetch("http://localhost:3001/api/meta/account_types")
            .then(response => {
                return response.json();
            })
            .then(data => {
                setAccountTypes(data);
                setTrackedAccount({
                    ...trackedAccount,
                    type: data[0]
                });
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setTrackedAccount({
            ...trackedAccount,
            [e.target.name]: e.target.value
        })
    }

    const handleAccountCreation = () => {
        // validate trackedAccount data
        if(trackedAccount.description.trim().length == 0 || trackedAccount.name.trim().length == 0) {
            // TODO: Empty description OR nickname (whichever contains just whitespace, and re-render)
            // TODO: Also, while you're at it, do this on the register/login pages
            console.info("Account nickname and description must contain text");
            return;
        }
        // swap out the account type name for the id
        for (const i in accountTypes) {
            if (accountTypes[i].name == trackedAccount.type) {
                setTrackedAccount({
                    ...trackedAccount,
                    type: accountTypes[i].id
                });
                break;
            }
        }
        // the format for trackedAccount here is wrong for some reason.
        /* EXAMPLE
        {
  "id": -1,
  "name": "barack obama",
  "description": "he's really rich",
  "type": {
    "id": "1",
    "name": "Checking"
  }
}
         */
        console.log(trackedAccount);
        fetch("http://localhost:3001/api/user/add_account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(trackedAccount),
            credentials: "include"
        }).then((response) => {
            return response.json();
        }).then((data) => {
            // reset the form
            setTrackedAccount({
                id: -1,
                name: "",
                description: "",
                type: ""
            });
            accountCreationHandler({
                id: data.acct_id,
                name: trackedAccount.name,
                description: trackedAccount.description,
                type: trackedAccount.type
            });
        }).catch((error) => console.error(error));
    }

    return (
        <>
            <h1 className="font-bold">Add an Account to Track</h1>
            <fieldset className="fieldset">
                <input
                    type="text"
                    className="grow input validator"
                    minLength={1}
                    placeholder='"Checking xxxx1234" or "Emergency Savings"'
                    value={trackedAccount.name}
                    onChange={handleChange}
                    name="name"
                    required
                />
                <textarea
                    className="textarea validator"
                    minLength={1}
                    placeholder='"The account for personal spending" or "My emergency fund savings account"'
                    name="description"
                    value={trackedAccount.description}
                    onChange={handleChange}
                    required></textarea>
                <select
                    className="select mb-3"
                    value={trackedAccount.type}
                    name="type"
                    onChange={handleChange}>
                    {/* we'll want to populate this with data from the db */
                        accountTypes.map((type) => {
                            return (<option key={type.id} value={type.id}>{type.name}</option>)
                        })
                    }
                </select>
            </fieldset>
            <button className="btn btn-primary" onClick={handleAccountCreation}>Add Account</button>
        </>
    );
}