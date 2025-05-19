import { useState } from "react";
import { Spacer, TYPOPGRAPHY } from "../../../common/styles";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, Input, Label, ModalTitle } from "../Modal.styles";
import { isValidLength } from "../../../common/helpers";
import { ColorSelector } from "../../ColorSelector/ColorSelector";
import useTagStore from "../../../store/useTagStore";
import useDashboardStore from "../../../store/useDashboardStore";
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import { Plus } from "lucide-react";
import { Tooltip } from "@mui/material";

const NewTagButton = styled.button`
    border: none;
    background: inherit;
    color: ${({ theme }) => theme.COLORS.TEXT_COLOR};
    display: inline;
    vertical-align: middle;
    cursor: pointer;
    &:hover {
        color: #99a1af;
    }
;
`;

export default function AddNewTagModal() {
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedColorError, setSelectedColorError] = useState("");
    const { addNewDashboardTag } = useTagStore();
    const { currentDashboardId } = useDashboardStore();

    const clearFormData = () => {
        setTitle("");
        setTitleError("");
        setSelectedColor(null);
        setSelectedColorError("");
    }

    const handleOpen = () => {
        clearFormData();
        setOpen(true);
    }

    const handleClose = () => {
        clearFormData();
        setOpen(false);
    }

    const handleSubmit = async (e: any) => {
        setTitleError("");
        setSelectedColorError("");
        e.preventDefault();
        if (!title.trim()) {
            setTitleError("Name is required.");
            return;
        }
        if (!isValidLength(title, 25)) {
            setTitleError("Name cannot exceed 25 character limit.");
            return;
        }
        if (!selectedColor) {
            setSelectedColorError("Please select a color for the tag.");
            return;
        }
        await addNewDashboardTag(currentDashboardId, {
            id: uuidv4(),
            name: title,
            color: selectedColor,
        });
        handleClose();
    }

    return (
        <>
            <Tooltip title="Add new tag" placement="top">
                <NewTagButton
                    onClick={handleOpen}
                >
                    <Plus />
                </NewTagButton></Tooltip>
            <ModalWrapper setIsOpen={setOpen} isOpen={open}>
                <ModalTitle>Add a new tag</ModalTitle>
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
                    <Label>Color</Label>
                    <ColorSelector
                        selected={selectedColor}
                        setSelected={setSelectedColor}
                    />
                    {selectedColorError && <ErrorText>{selectedColorError}</ErrorText>}
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
