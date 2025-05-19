import React from "react";
import styled from "styled-components";
import { FlexEnd, FlexStart } from "../../common/styles";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const Container = styled.div`
    margin-bottom: -45px;
    padding: 1rem;
    overflow: hidden;
`;
const Header:React.FC = () => {
    return (
        <Container>
            <FlexStart>
                asd
            </FlexStart>
            <FlexEnd>
                <ThemeSwitch/>
            </FlexEnd>
        </Container>
    )
}
export default Header;