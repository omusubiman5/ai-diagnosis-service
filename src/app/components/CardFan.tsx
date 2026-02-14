'use client';

import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const cards = [
    { id: 1, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Cash Card' },
    { id: 2, gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)', label: 'Cash Card' },
    { id: 3, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Cash Card' },
    { id: 4, gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', label: 'Cash Card' },
    { id: 5, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Cash Card' },
    { id: 6, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Cash Card' },
];

const FAN_ANGLES = [-82.5, -75, -60, -45, -30, -15];
const STACKED_ANGLE = -90;

interface FanCardProps {
    card: (typeof cards)[number];
    index: number;
    scrollYProgress: MotionValue<number>;
}

function FanCard({ card, index, scrollYProgress }: FanCardProps) {
    const angle = useTransform(
        scrollYProgress,
        [0, 1],
        [STACKED_ANGLE, FAN_ANGLES[index]]
    );

    const radius = 120;
    const transform = useTransform(
        angle,
        (v) => `translate(-50%, -50%) rotate(${v}deg) translateY(-${radius}px)`
    );

    const isWhite = card.id === 4;

    return (
        <motion.div
            className="card"
            style={{ transform }}
        >
            <div
                className="card-content"
                style={{
                    background: card.gradient,
                    color: isWhite ? '#333' : 'rgba(255,255,255,0.8)',
                }}
            >
                <div
                    className="card-chip"
                    style={{
                        background: isWhite
                            ? 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
                    }}
                />
                <div
                    className="card-text"
                    style={{ color: isWhite ? '#333' : 'rgba(255,255,255,0.8)' }}
                >
                    {card.label}
                </div>
            </div>
        </motion.div>
    );
}

export default function CardFan() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'center center'],
    });

    return (
        <Box
            ref={containerRef}
            className="card-fan-container"
            role="img"
            aria-label="Card fan animation"
        >
            {cards.map((card, index) => (
                <FanCard
                    key={card.id}
                    card={card}
                    index={index}
                    scrollYProgress={scrollYProgress}
                />
            ))}
        </Box>
    );
}
