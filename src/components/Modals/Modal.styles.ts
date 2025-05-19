import styled from "styled-components";
import { TYPOPGRAPHY } from "../../common/styles";

const FORM_STYLES = {
    BORDER_RADIUS: "0.5rem"
}
export const ModalTitle = styled.h1`
    font-family: ${TYPOPGRAPHY.INTER};
    font-size: 1.5rem;
`;
export const SupportingText = styled.p`
    color: #4a5565;
    text-align: center;
    font-family: ${TYPOPGRAPHY.INTER};
    font-size: 0.95rem;
`;
export const Form = styled.form`
    display: flex;
    flex-direction: column;
    font-family: ${TYPOPGRAPHY.INTER};
`;
export const FormItem = styled.div`
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
`;
export const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 600; 
    letter-spacing: 0.05em; 
`;
export const Input = styled.input`
    background-color: #f1f5f9;
    border-radius: ${FORM_STYLES.BORDER_RADIUS}; 
    margin-top: 0.5rem;
    height: 2.5rem;
    border: none;
    outline: none;
    padding-inline: 0.75rem;
    font-family: inherit;
`;
export const TextArea = styled.textarea`
    background-color: #f1f5f9;
    border-radius: ${FORM_STYLES.BORDER_RADIUS};
    margin-top: 0.5rem;
    border: none;
    outline: none;
    padding: 0.75rem;
    font-family: inherit;
    max-width: 100%;
    resize: vertical;
    max-height: 200px;
    min-height: 100px;
`;
export const ErrorText = styled.p`
    color: #ef4444;
    font-size: 0.875rem; 
    margin: 0.5rem 0; 
`;

export const NewTaskButton = styled.button`
    border: none;
    text-deocoration: none;
    padding: 1rem 2rem;
    background: inherit;
    color: ${({ theme }) => theme.COLORS.TEXT_COLOR};
    font-family: ${TYPOPGRAPHY.OSWALD};
    font-size: 1.2rem;
    border-block: ${({ theme }) => `1px solid ${theme.COLORS.BORDER_COLOR_LIGHT}`};
    width: 100%;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    letter-spacing: 0.025rem;

    &:hover {
        background: rgb(121, 151, 194);
        color: inherit;
    }
`;

export const FormDropdown = styled.select`
    background-color: #f1f5f9;
    height: 2.5rem;
    margin-top: 0.5rem;
    width: 100%;
    padding-inline: 0.75rem;
    border-radius: ${FORM_STYLES.BORDER_RADIUS};
`;
export const Option = styled.option`
    font-family: ${TYPOPGRAPHY.INTER};
    padding-block: 0.5rem;
`;