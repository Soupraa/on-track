import styled from "styled-components";
import { TYPOPGRAPHY } from "../../common/styles";

export const TopbarContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.MAIN_BACKGROUND};
`;

export const Title = styled.h1`
  font-family: "Jersey", cursive;
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  letter-spacing: 0.05em;
`;

export const DashboardList = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-bottom: ${({ theme }) => `1px solid ${theme.COLORS.BORDER_COLOR_LIGHT}`};
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DashboardButton = styled.button<{ $isActive: boolean }>`
    min-width: 0;
    flex-shrink: 1;
    padding: 0.8rem 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1rem;
    background: ${({ $isActive }) => ($isActive ? "rgb(121, 151, 194)" : "inherit")};
    color: ${({ $isActive, theme }) => ($isActive ? theme.COLORS.INVERSE_TEXT_COLOR : theme.COLORS.TEXT_COLOR)};
    border: none;
    padding: 0.5rem 1rem;
    width: fit-content; 
    cursor: pointer;
    font-family: ${TYPOPGRAPHY.OSWALD};
    letter-spacing: 0.02em; 
    vertical-align: middle; 
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: rgb(121, 151, 194);
        color: ${({ theme }) => theme.COLORS.INVERSE_TEXT_COLOR};
    }
`