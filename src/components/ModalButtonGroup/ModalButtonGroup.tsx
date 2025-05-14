import React from "react";
import { Button, ButtonGroup } from "./ModalButtonGroup.styles";

interface ModalButtonGroupProps {
    leftLabel: string;
    rightLabel: string;
    closeModalFunc: () => void;
}

const ModalButtonGroup: React.FC<ModalButtonGroupProps> = ({
    leftLabel,
    rightLabel,
    closeModalFunc,
}) => {
    return (
        <ButtonGroup>
            <Button
                aria-label="close modal button"
                type="button"
                color="red"
                onClick={closeModalFunc}
            >
                {leftLabel}
            </Button>
            <Button
                aria-label={`${rightLabel} button`}
                type="submit"
                color="green"
            >
                {rightLabel}
            </Button>
        </ButtonGroup>
    );
};

export default ModalButtonGroup;
