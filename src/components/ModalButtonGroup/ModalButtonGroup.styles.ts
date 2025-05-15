import styled from "styled-components";
import { TYPOPGRAPHY } from "../../common/styles";

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: space-between;
  font-size: 1.25rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const Button = styled.button<{ color: "red" | "green" }>`
  border: 0.5px solid #000;
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.5rem;
  font-family: ${TYPOPGRAPHY.SQUADA_ONE};
  font-weight: 400;
  font-style: normal;
  font-size: 1.2rem;
  letter-spacing: 0.025em;
  transition: background-color 0.3s ease;
  cursor: pointer;

  @media (min-width: 640px) {
    width: 50%;
  }

  &:hover {
    background-color: ${(props) =>
        props.color === "red" ? "#f87171" : "#86efac"};
  }
`;