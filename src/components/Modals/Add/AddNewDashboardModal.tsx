import { Plus } from "lucide-react";
import { useState } from "react";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, Input, Label, ModalTitle } from "../Modal.styles";
import { isValidLength } from "../../../common/helpers";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import { COLOR, Spacer } from "../../../common/styles";
import useDashboardStore from "../../../store/useDashboardStore";
import { Tooltip } from "@mui/material";
import styled from "styled-components";

const AddNewButton = styled.button`
    cursor: pointer;
    border: none;
    background: inherit;
    color: white;
    padding-inline: 1rem;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: rgb(220, 234, 255);
        color: inherit;
    }

`;
export default function AddNewDashboardModal() {
    const { addNewDashboard } = useDashboardStore();
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");

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
            <Tooltip title="Add new dashboard" placement="top">
                <AddNewButton
                    onClick={handleOpen}
                >
                    <Plus />
                </AddNewButton>
            </Tooltip>
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