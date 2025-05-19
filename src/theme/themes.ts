import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  COLORS: {
    MAIN_BACKGROUND: 'rgb(255, 250, 241)',
    TEXT_COLOR: 'black',
    INVERSE_TEXT_COLOR: 'white',
    SECONDARY_BACKGROUND: '#f0f0f0',
    BORDER_COLOR: '#ccc',
    BORDER_COLOR_LIGHT: 'rgb(18, 19, 20)',
    COLUMN_HOVER_COLOR: 'rgb(219, 208, 186)'
  },
};

export const darkTheme: DefaultTheme = {
  COLORS: {
    MAIN_BACKGROUND: '#110f17',
    TEXT_COLOR: 'white',
    INVERSE_TEXT_COLOR: 'black',
    SECONDARY_BACKGROUND: '#1a1a1a',
    BORDER_COLOR: '#727272',
    BORDER_COLOR_LIGHT: 'rgb(255, 255, 255)',
    COLUMN_HOVER_COLOR: '#312c43'
  },
};