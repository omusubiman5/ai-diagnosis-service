'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#111111', // Almost Black
        },
        secondary: {
            main: '#666666', // Dark Gray
        },
        background: {
            default: '#FFFFFF', // Clean White
            paper: '#FAFAFA', // Very Light Gray
        },
        text: {
            primary: '#111111',
            secondary: '#444444',
        },
    },
    typography: {
        fontFamily: 'var(--font-nanum-myeongjo), serif',
        fontSize: 14,
        h1: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: '2.5rem',
            '@media (min-width:600px)': {
                fontSize: '4.5rem', // Larger for Hero
            },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.06em', // Tight spacing from Interlude
        },
        h2: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: '2rem',
            '@media (min-width:600px)': {
                fontSize: '2.5rem',
            },
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.04em',
        },
        h3: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: '1.5rem',
            '@media (min-width:600px)': {
                fontSize: '2rem',
            },
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: '-0.03em',
        },
        h4: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontWeight: 700,
        },
        h5: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontWeight: 700,
        },
        h6: {
            fontFamily: 'var(--font-ibm-plex-mono), monospace', // Use Mono for smaller headings/tags
            fontWeight: 500,
            letterSpacing: '0.02em',
        },
        body1: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: '1rem',
            lineHeight: 1.8,
            letterSpacing: '0.02em',
        },
        body2: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            letterSpacing: '0.02em',
        },
        caption: {
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
        },
        button: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '0.02em',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 9999, // Pill shape
                    padding: '10px 32px',
                    minHeight: '48px',
                    boxShadow: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#333333',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#F0F0F0',
                    color: '#111111',
                    '&:hover': {
                        backgroundColor: '#E0E0E0',
                    },
                },
                outlined: {
                    borderColor: '#E0E0E0',
                    color: '#111111',
                    '&:hover': {
                        borderColor: '#111111',
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiContainer: {
            defaultProps: {
                maxWidth: 'lg',
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    border: 'none', // Removed borders as per new design
                },
                elevation1: {
                    boxShadow: 'none',
                },
            },
        },
    },
});

export default theme;
