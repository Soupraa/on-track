import React from "react";
import styled from "styled-components";
import { FlexEnd, FlexStart, TYPOPGRAPHY } from "../../common/styles";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import LiveClock from "../LiveClock/LiveClock";

const Container = styled.div`
    margin-bottom: -35px;
    padding-block: 0.6rem;
    padding-inline: 0.6rem;
    overflow: hidden;
`;
const ClockContainer = styled.div`
    color: ${({ theme }) => theme.COLORS.TEXT_COLOR};
    font-family: ${TYPOPGRAPHY.SQUADA_ONE};
    font-size: 1.5rem;
    user-select: none;
    -webkit-user-select: none; 
    -moz-user-select: none;
    -ms-user-select: none;
`;
const Header: React.FC = () => {
    return (
        <Container>
            <FlexStart>
                <ClockContainer>
                    <LiveClock />
                </ClockContainer>
            </FlexStart>
            <FlexEnd>
                <ThemeSwitch />
            </FlexEnd>
        </Container>
    )
}
export default Header;