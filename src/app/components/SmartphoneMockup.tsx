'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SmartphoneMockup() {
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLImageElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 1.0 }); // Start after hero text

        // Initial state
        // Animation from hidden state
        tl.from(containerRef.current, {
            opacity: 0,
            y: 100,
            duration: 1.5,
            ease: 'power3.out'
        })
            .to(containerRef.current, {
                y: -15, // Float up slightly
                duration: 3, // Slow
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });

    }, { scope: containerRef });

    return (
        <Box
            ref={containerRef}
            sx={{
                position: 'relative',
                width: '280px', // Base width for mobile/mockup
                height: '570px', // Aspect ratio based on standard phone
                mx: 'auto',
                mt: 8, // Spacing from top content
                zIndex: 1,
                perspective: '1000px',
                border: '2px solid red', // DEBUG: Confirm position
                '@media (min-width: 600px)': {
                    width: '320px',
                    height: '650px',
                }
            }}
        >
            {/* Shadow Layer - Bottom */}
            <Box
                component="img"
                ref={shadowRef}
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
                    pointerEvents: 'none'
                }}
            />

            {/* Phone Container (Bezel + Screen) */}
            <Box
                ref={phoneRef}
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
