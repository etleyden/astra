import {useState, useRef, useEffect} from "react";

interface DialogPopupProps {
    dialogIsOpen?: boolean;
    children: React.ReactNode;
}
export default function DialogPopup({dialogIsOpen = false, children}: DialogPopupProps) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(dialogIsOpen);

    useEffect(() => {
        setIsOpen(dialogIsOpen);

    }, [dialogIsOpen]);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);
    return (
        <dialog className="modal" ref={modalRef}>
            <div className="modal-box">
                {children}
                <button className="btn btn-error mx-2" onClick={() => setIsOpen(false)}>Close</button>
            </div>
        </dialog>
    )
}