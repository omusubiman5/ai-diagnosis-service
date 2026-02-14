'use client';

import React from 'react';
import { Box } from '@mui/material';

export default function SmartphoneMockup() {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '280px',
                height: '570px',
                mx: 'auto',
                zIndex: 1,
                '@media (min-width: 600px)': {
                    width: '320px',
                    height: '650px',
                }
            }}
        >
            {/* Shadow Layer - Bottom */}
            <Box
                component="img"
                src="https://framerusercontent.com/images/a9gc2DlbpkkZlsKZRlBfRklZyY.png"
                alt="Shadow"
                sx={{
                    position: 'absolute',
                    bottom: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '140%', // Shadow is wider than phone
                    maxWidth: 'none',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.6
                }}
            />

            {/* Phone Container (Bezel + Screen) */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                }}
            >
                {/* Bezel Layer - Top */}
                <Box
                    component="img"
                    src="https://framerusercontent.com/images/vlPPtTpJLNwdD3AZk39BNYkk.png"
                    alt="Smartphone Frame"
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        pointerEvents: 'none',
                        objectFit: 'contain'
                    }}
                />

                {/* Screen Layer - Video - Behind Bezel */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '12px', // Adjustments for bezel thickness
                        left: '14px',
                        right: '14px',
                        bottom: '12px',
                        borderRadius: '35px', // Match bezel corners
                        overflow: 'hidden',
                        zIndex: 5,
                        backgroundColor: '#333', // Placeholder visible
                    }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    >
                        <source src="https://framerusercontent.com/assets/iXftkIHRWyygk1gHpsrKZBQSauQ.mp4" type="video/mp4" />
                    </video>
                </Box>
            </Box>
        </Box>
    );
}
