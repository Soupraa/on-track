import styled from "styled-components";

export const TYPOPGRAPHY  = {
    SQUADA_ONE: '"Squada One", sans-serif',
    INTER: 'Inter, sans-serif',
    OSWALD: 'Oswald, sans-serif'
}
export const COLOR = {
    MAIN_BACKGROUND: "#0a0a0a",
    SECONDARY_BACKGROUND: "#1a1a1a"
}
export const FlexStart = styled.div`
    justify-content: flex-start;
    align-items: center;
    width: 50%;
    display: inline-flex;
;
`;
export const FlexMiddle = styled.div`
    display: flex;
`;

export const FlexEnd = styled.div`
    justify-content: flex-end;
    align-items: center;
    width: 50%;
    display: inline-flex;
`;

export const Spacer = styled.div<{ $space?: string }>`
  margin-bottom: ${({ $space }) => $space || "0rem"};
`;