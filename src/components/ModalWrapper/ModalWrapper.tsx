import React, { ReactNode } from "react";
import { Box, Modal } from "@mui/material";

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    minHeight: "'fit-content",
};

interface IModalProps {
    children: ReactNode
    setIsOpen(open: boolean): void
    isOpen: boolean
}
const ModalWrapper: React.FC<IModalProps> = ({ children, setIsOpen, isOpen }) => {
    return (
        <Modal
            open={isOpen}
            onClose={() => setIsOpen(isOpen)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {children}
            </Box>
        </Modal>

    );
};

export default ModalWrapper;
