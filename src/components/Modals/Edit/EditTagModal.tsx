import { useCallback, useEffect, useState } from "react";
import useTagStore from "../../../store/useTagStore";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, Input, Label, ModalTitle } from "../Modal.styles";
import { Spacer } from "../../../common/styles";
import { ColorSelector } from "../../ColorSelector/ColorSelector";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import { isValidLength } from "../../../common/helpers";

interface IEditTagModal {
    showModal: boolean;
    setShowModal(showModal: boolean): void;
}

const EditTagModal: React.FC<IEditTagModal> = ({ showModal, setShowModal }) => {
    const { tagIdToEdit, getTagById, updateTag } = useTagStore();
    const [title, setTitle] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string | null>("");
    const [selectedColorError, setSelectedColorError] = useState<string>("");

    const clearFormErrors = () => {
        setTitleError("");
        setSelectedColorError("");
    }

    const handleClose = useCallback(() => {
        setShowModal(false);
        clearFormErrors();
    }, [setShowModal]);

    const handleOpen = useCallback(() => {
        const tag = getTagById(tagIdToEdit);
        setTitle(tag?.name || "");
        setSelectedColor(tag?.color || "");
        clearFormErrors();
    }, [getTagById, tagIdToEdit]);

    const handleSubmit = async (e: any) => {
        clearFormErrors();
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
        await updateTag(tagIdToEdit, { name: title, color: selectedColor });
        handleClose();
    }
    useEffect(() => {
        if (showModal) {
            handleOpen();
        } else {
            handleClose();
        }
    }, [showModal, handleOpen, handleClose]);
    return (
        <ModalWrapper setIsOpen={setShowModal} isOpen={showModal}>
            <ModalTitle>Edit tag</ModalTitle>
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
    )
}
export default EditTagModal;