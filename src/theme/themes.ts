import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  COLORS: {
    MAIN_BACKGROUND: 'white',
    TEXT_COLOR: 'black',
    INVERSE_TEXT_COLOR: 'white',
    SECONDARY_BACKGROUND: '#f0f0f0',
    BORDER_COLOR: '#ccc',
    BORDER_COLOR_LIGHT: 'rgb(18, 19, 20)',
    COLUMN_HOVER_COLOR: 'rgb(162, 165, 170)'
  },
};

export const darkTheme: DefaultTheme = {
  COLORS: {
    MAIN_BACKGROUND: '#0a0a0a',
    TEXT_COLOR: 'white',
    INVERSE_TEXT_COLOR: 'black',
    SECONDARY_BACKGROUND: '#1a1a1a',
    BORDER_COLOR: '#727272',
    BORDER_COLOR_LIGHT: 'rgb(220, 234, 255)',
    COLUMN_HOVER_COLOR: '#1a1a1a'
  },
};