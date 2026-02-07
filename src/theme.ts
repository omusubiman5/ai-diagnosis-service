'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#205493', // Trust Blue
        },
        secondary: {
            main: '#32CD32', // Growth Green
        },
        background: {
            default: '#F5F7FA', // Warm Beige/Light Gray
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333', // Dark Gray
        },
    },
    typography: {
        fontFamily: [
            '"Helvetica Neue"',
            'Arial',
            '"Hiragino Kaku Gothic ProN"',
            '"Hiragino Sans"',
            'Meiryo',
            'sans-serif',
        ].join(','),
        fontSize: 14, // Base size, but specific elements will be larger
        h1: {
            fontSize: '2rem', // 32px
            '@media (min-width:600px)': {
                fontSize: '3rem', // 48px
            },
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.5rem', // 24px
            '@media (min-width:600px)': {
                fontSize: '2.25rem', // 36px
            },
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.25rem', // 20px
            '@media (min-width:600px)': {
                fontSize: '1.5rem', // 24px
            },
            fontWeight: 700,
        },
        body1: {
            fontSize: '1.125rem', // 18px (Senior Friendly)
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '12px 24px',
                    minHeight: '44px', // Touch target size
                },
                containedSecondary: {
                    color: '#FFFFFF',
                    fontSize: '1.125rem',
                    boxShadow: '0 4px 6px rgba(50, 205, 50, 0.3)',
                    '&:hover': {
                        backgroundColor: '#2eb82e',
                        boxShadow: '0 6px 8px rgba(50, 205, 50, 0.4)',
                    },
                },
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: 'lg',
            },
        },
    },
});

export default theme;
