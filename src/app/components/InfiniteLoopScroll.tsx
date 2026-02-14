'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * InfiniteLoopScroll Component
 * 
 * Wraps content and creates a seamless infinite scroll effect by duplicating the content.
 * When the user scrolls past the original content height, it silently jumps back to the start.
 */
export default function InfiniteLoopScroll({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const originalRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Measure content height
    useEffect(() => {
        if (!originalRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContentHeight(entry.contentRect.height);
            }
        });

        observer.observe(originalRef.current);
        setIsReady(true);

        return () => observer.disconnect();
    }, []);

    // Handle scroll loop
    useEffect(() => {
        if (!contentHeight) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            // Forward loop: When we reach the start of the cloned content
            // (which is visually identical to the start of original content)
            if (scrollY >= contentHeight) {
                window.scrollTo({
                    top: scrollY - contentHeight,
                    behavior: 'instant' // Critical for seamless jump
                });
            }

            // Optional: Backward loop (if needed later)
            // if (scrollY <= 0) { ... }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [contentHeight]);

    return (
        <Box ref={containerRef} sx={{ position: 'relative' }}>
            {/* Original Content */}
            <div ref={originalRef}>
                {children}
            </div>

            {/* Cloned Content (only visible when hydration/measurements done) */}
            {isReady && (
                <div aria-hidden="true" className="infinite-scroll-clone">
                    {children}
                </div>
            )}
        </Box>
    );
}
