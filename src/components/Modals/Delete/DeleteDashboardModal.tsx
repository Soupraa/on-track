import { useCallback, useEffect, useState } from "react";
import { CenterAlignContent, Spacer } from "../../../common/styles";
import ModalButtonGroup from "../../ModalButtonGroup/ModalButtonGroup";
import ModalWrapper from "../../ModalWrapper/ModalWrapper";
import { Form, ModalTitle, SupportingText } from "../Modal.styles";
import useDashboardStore from "../../../store/useDashboardStore";

interface IDeleteDashboardModal {
    showModal: boolean;
    setShowModal(showModal: boolean): void;
}

const DeleteDashboardModal: React.FC<IDeleteDashboardModal> = ({ showModal, setShowModal }) => {
    const [title, setTitle] = useState<string>("");
    const { dashboardToEditId, getDashboardById, deleteDashboard } = useDashboardStore();

    const handleOpen = useCallback(() => {
        const dashboard = getDashboardById(dashboardToEditId);
        setTitle(dashboard?.title || "");
    }, [dashboardToEditId]);

    const handleClose = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        deleteDashboard(dashboardToEditId);
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
            <CenterAlignContent>
                <ModalTitle>Are you sure you want to delete</ModalTitle>
                <ModalTitle>{title}</ModalTitle>
            </CenterAlignContent>
            <SupportingText>You will lose all your data related to this dashboard.</SupportingText>
            <Form onSubmit={handleSubmit}>
                <Spacer $space="2rem" />
                <ModalButtonGroup
                    leftLabel={"Close"}
                    rightLabel={"Delete"}
                    closeModalFunc={handleClose}
                />
            </Form>
        </ModalWrapper>
    )
}
export default DeleteDashboardModal;