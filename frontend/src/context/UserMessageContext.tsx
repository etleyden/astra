"use client";
import {createContext, useContext, useState} from "react";
import { IoClose } from "react-icons/io5";

interface UserMessageContextType {
    info: (message: string) => void;
    error: (message: string) => void;
    success: (message: string) => void;
}

const UserMessageContext = createContext<UserMessageContextType | undefined>(undefined);

enum MessageTypes {
    SUCCESS, ERROR, INFO, NONE // success = 0, error = 1 in true linux fashion
}

const defaultMessageDuration = 3000;
// TODO: fade in/fade out animation
export function UserMessageProvider({ children }: {children: React.ReactNode }) {
    const [currentMessageType, setCurrentMessageType] = useState<MessageTypes>(MessageTypes.NONE);
    const [message, setMessage] = useState<string>("");
    const [messageClassName, setMessageClassName] = useState<string>("hidden");
    const [messageIcon, setMessageIcon] = useState<React.ReactElement>(<></>);

    const info = (new_message: string, duration: number = defaultMessageDuration) => {
        // send message to UI
        setCurrentMessageType(MessageTypes.INFO);
        setMessageIcon(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        );
        setMessageClassName("alert-info");
        setMessage(new_message);
        setTimeout(clearMessage, duration);
    }

    const error = (new_message: string, duration: number = defaultMessageDuration) => {
        setCurrentMessageType(MessageTypes.ERROR);
        setMessageIcon(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
        setMessageClassName("alert-error");
        setMessage(new_message);
        setTimeout(clearMessage, duration);        
    }

    const success = (new_message: string, duration: number = defaultMessageDuration) => {
        setCurrentMessageType(MessageTypes.SUCCESS);
        setMessageIcon(
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
        setMessageClassName("alert-success");
        setMessage(new_message);
        setTimeout(clearMessage, duration);
    }

    const clearMessage = () => {
        setCurrentMessageType(MessageTypes.NONE);
        setMessageClassName("hidden");
        setMessage("Something went wrong with our UI messaging system");
    }

    return (
        <UserMessageContext.Provider value={{ info, error, success }}>
            {children}
            <div role="alert" className={`absolute left-1/2 transform -translate-x-1/2 bottom-0 mb-5 w-9/10 alert ${messageClassName}`}>
                {messageIcon}
                <span>{message}</span>
                {/* TODO: Change mouse icon on hover over this close icon */}
                <button onClick={clearMessage}>
                    <IoClose />
                </button>
            </div>
        </UserMessageContext.Provider>
    )
}

export function useUserMessages() {
    const context = useContext(UserMessageContext);
    if (!context) {
        throw new Error("useUserMessages must be used within a UserMessageProvider");
    }
    return context;
}