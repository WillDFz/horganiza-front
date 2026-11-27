'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode } from 'react';
import { BRAND_COLORS } from '@/styles/tokens';

const theme = createTheme({
    palette: {
        primary: {
            main: BRAND_COLORS.primary,
            light: BRAND_COLORS.primaryLight,
            dark: BRAND_COLORS.primaryDark,
        },
        secondary: {
            main: BRAND_COLORS.secondary,
            light: BRAND_COLORS.secondaryLight,
            dark: BRAND_COLORS.secondaryDark,
        },
    },
    components: {
        MuiCircularProgress: {
            defaultProps: {
                color: 'primary',
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: BRAND_COLORS.primary,
                    },
                },
            },
        },
    },
});

interface MuiThemeProviderProps {
    children: ReactNode;
}

const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
