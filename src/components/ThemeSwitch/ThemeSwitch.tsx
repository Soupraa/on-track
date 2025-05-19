import { useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useAppStore from '../../store/useAppStore';
import styled from 'styled-components';


const ThemeSwitchButton = styled.button`
    border-radius: 3px;
    color: ${({ theme }) => theme.COLORS.INVERSE_TEXT_COLOR};
    background: inherit;
    border: none;
    padding: 0.5px;
    cursor: pointer;
`;
export default function ThemeSwitch() {
    const { isLightMode, setIsLightMode, loadAppData } = useAppStore();

    useEffect(() => {
        loadAppData();
    }, []);

    const handleToggle = () => {
        setIsLightMode(!isLightMode);
    };

    return (
        <Tooltip  title={isLightMode ? "Click for night mode": "Click for light mode"}>
            <ThemeSwitchButton onClick={handleToggle}>
                {isLightMode ? <DarkModeIcon
                    fontSize="small"
                    style={{ color: isLightMode ? "#78A8C6" : "#78A8C6" }}
                /> : <LightModeIcon
                    fontSize="small"
                    style={{ color: isLightMode ? "#78A8C6" : "#FAA300" }}
                />}
            </ThemeSwitchButton>
        </Tooltip>
    );
}
