'use client';

import React from 'react';
import { Box } from '@mui/material';

// Card definitions with gradients matching Cash App styles
const cards = [
    { id: 1, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Cash Card' },
    { id: 2, gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)', label: 'Cash Card' },
    { id: 3, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Cash Card' },
    { id: 4, gradient: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', label: 'Cash Card' }, // White
    { id: 5, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Cash Card' },
    { id: 6, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Cash Card' }, // Green
];

export default function CardFan() {
    return (
        <Box className="card-fan-container" role="img" aria-label="Card fan animation">
            {cards.map((card, index) => (
                <div key={card.id} className="card">
                    <div
                        className="card-content"
                        style={{
                            background: card.gradient,
                            // Ensure text contrast for white card
                            color: card.id === 4 ? '#333' : 'rgba(255,255,255,0.8)'
                        }}
                    >
                        <div className="card-chip" style={{
                            background: card.id === 4
                                ? 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)'
                                : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)'
                        }} />
                        <div className="card-text" style={{
                            color: card.id === 4 ? '#333' : 'rgba(255,255,255,0.8)'
                        }}>
                            {card.label}
                        </div>
                    </div>
                </div>
            ))}
        </Box>
    );
}
