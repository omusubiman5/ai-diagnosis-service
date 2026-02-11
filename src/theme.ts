'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00D632', // Cash App Green
        },
        secondary: {
            main: '#FFFFFF', // White
        },
        background: {
            default: '#000000', // Deep Black
            paper: '#111111', // Dark Gray
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#999999',
        },
    },
    typography: {
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: 14,
        h1: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontFamily: 'var(--font-nanum-myeongjo), serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontWeight: 500,
            letterSpacing: '0.05em',
        },
        body1: {
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
        },
        body2: {
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
        },
        caption: {
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
        },
        button: {
            fontFamily: 'var(--font-inter), sans-serif',
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 9999,
                    padding: '12px 32px',
                    minHeight: '48px',
                    boxShadow: '0 4px 14px 0 rgba(0, 214, 50, 0.39)',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 20px rgba(0, 214, 50, 0.23)',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#00D632',
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#00B82B',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.39)',
                    '&:hover': {
                        backgroundColor: '#F0F0F0',
                    },
                },
                outlined: {
                    borderColor: '#333333',
                    color: '#FFFFFF',
                    boxShadow: 'none',
                    '&:hover': {
                        borderColor: '#FFFFFF',
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
                    backgroundColor: '#111111',
                    boxShadow: 'none',
                    border: '1px solid #222222',
                },
            },
        },
    },
});

export default theme;
