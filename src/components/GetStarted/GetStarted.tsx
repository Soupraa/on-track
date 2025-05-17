import React from "react"
import styled from "styled-components";
import { COLOR, TYPOPGRAPHY } from "../../common/styles";

const GetStartedContainer = styled.div`
    width: fit-content;
    height: 100vh;
    margin: auto;
`;
const StartButton = styled.button`
    background: inherit;
    border: 1px dashed ${COLOR.BORDER_COLOR_LIGHT};
    padding: 2.5rem;
    font-size: 3rem;
    font-family: ${TYPOPGRAPHY.OSWALD};
    color: white;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: ${COLOR.BORDER_COLOR};
    }
`;
const P = styled.p`
    color: white;
    text-align: center;
    font-size: 1.2rem;
`;
const Content = styled.div`
    display: flex;
    justify-content: center;
    height: 85%;
    align-items: center;
`;
const GetStarted: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
    return (
        <GetStartedContainer>
            <Content>
                <StartButton onClick={handleClick}>
                    START BY CREATING A NEW DASHBOARD
                    <P>Click me</P>
                </StartButton>
            </Content>
        </GetStartedContainer>
    )
}
export default GetStarted;