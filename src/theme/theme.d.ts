// styled.d.ts (or theme.d.ts) — must be in a place TypeScript can find
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    COLORS: {
      MAIN_BACKGROUND: string;
      TEXT_COLOR: string;
      INVERSE_TEXT_COLOR: string;
      SECONDARY_BACKGROUND: string;
      BORDER_COLOR: string;
      BORDER_COLOR_LIGHT: string;
      COLUMN_HOVER_COLOR: string;
    };
  }
}
