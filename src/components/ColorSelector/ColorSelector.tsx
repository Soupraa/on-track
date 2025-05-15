import React from "react";
import styled from "styled-components";

interface ColorSelectorProps {
    selected: string | null;
    setSelected: (color: string) => void;
    name?: string;
}

const Wrapper = styled.div`
  margin-block: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(8, 1fr);
  }
`;

const ColorButton = styled.button<{ $color: string; $selected: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 2px solid ${({ $selected }) => ($selected ? "#000" : "transparent")};
  background-color: ${({ $color }) => $color};
  transition: all 0.2s ease;
  transform: ${({ $selected }) => ($selected ? "scale(1.1)" : "scale(1)")};
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const colors: string[] = [
    "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6",
    "#B2ABBF", "#6EE7B7", "#FCA5A5", "#FDE68A", "#A7F3D0", "#BFDBFE",
    "#DDD6FE", "#F9A8D4", "#E879F9", "#9CFC97", "#C9ADA1", "#F98948",
    "#00B295", "#4FB0C6", "#BFC0C0", "#7B5E7B", "#F2A65A", "#8FB339"
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({ selected, setSelected, name }) => {
    return (
        <Wrapper>
            <Grid>
                {colors.map((color) => (
                    <ColorButton
                        key={color}
                        type="button"
                        $color={color}
                        $selected={selected === color}
                        onClick={() => setSelected(color)}
                    />
                ))}
            </Grid>
            {name && <HiddenInput type="hidden" name={name} value={selected || ""} />}
        </Wrapper>
    );
};
