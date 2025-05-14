import { Plus } from "lucide-react";
import React, { useState } from "react";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, Input, Label, ModalTitle } from "../Modal.styles";
import { isValidLength } from "../../../common/helpers";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import { Spacer } from "../../../common/styles";
import useDashboardStore from "../../../store/useDashboardStore";


export default function AddNewDashboardModal() {
    const { addNewDashboard } = useDashboardStore();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");

    const handleOpen = () => {
        setTitle("");
        setTitleError("");
        setOpen(true);

    }
    const handleClose = () => {
        setTitle("");
        setTitleError("");
        setOpen(false);
    }
    const handleSubmit = async (e: any) => {
        console.log("submitting", title)
        e.preventDefault();
        if (!title.trim()) {
            setTitleError("Name is required.");
            return;
        }
        if (!isValidLength(title, 30)) {
            setTitleError("Name cannot exceed 30 character limit.");
            return;
        }
        await addNewDashboard(title);
        handleClose();
    }
    return (
        <>
            <div className="tooltip" data-tip="Add new dashboard">
                <button
                    onClick={handleOpen}
                    className={
                        "px-4 py-2 rounded-t-2xl w-fit cursor-pointer font-oswald tracking-wide align-middle hover:bg-white transition-all"
                    }
                >
                    <Plus />
                </button>
            </div>
            <ModalWrapper setIsOpen={setOpen} isOpen={open}>
                <ModalTitle>Add a new dashboard</ModalTitle>
                <Form onSubmit={handleSubmit}>
                    <Label>Name</Label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {titleError && <ErrorText>{titleError}</ErrorText>}
                    <Spacer $space="2rem" />
                    <ModalButtonGroup
                        leftLabel={"Close"}
                        rightLabel={"Add"}
                        closeModalFunc={handleClose}
                    />
                </Form>
            </ModalWrapper>
        </>
    )
}