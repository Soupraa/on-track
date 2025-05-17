import { useCallback, useEffect, useState } from "react";
import { Spacer } from "../../../common/styles";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { ErrorText, Form, Input, Label, ModalTitle } from "../Modal.styles";
import { isValidLength } from "../../../common/helpers";
import useDashboardStore from "../../../store/useDashboardStore";

interface IEditDashboardModal {
    showModal: boolean;
    setShowModal(showModal: boolean): void;
}

const EditDashboardModal: React.FC<IEditDashboardModal> = ({ showModal, setShowModal }) => {
    const [title, setTitle] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");
    const { editExistingDashboard, dashboardToEditId, getDashboardById } = useDashboardStore();

    const handleOpen = useCallback(() => {
        const dashboard = getDashboardById(dashboardToEditId);
        setTitle(dashboard?.title || "");
    }, [dashboardToEditId]);

    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal, getDashboardById]);


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
        editExistingDashboard(dashboardToEditId, title);
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
            <ModalTitle>Edit dashboard</ModalTitle>
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
                    rightLabel={"Update"}
                    closeModalFunc={handleClose}
                />
            </Form>
        </ModalWrapper>
    )
}
export default EditDashboardModal;