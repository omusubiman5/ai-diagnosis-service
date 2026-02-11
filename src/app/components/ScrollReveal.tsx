'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    animation?: 'fade-in' | 'slide-up' | 'slideUp';
    delay?: number;
    duration?: number;
    threshold?: number;
    className?: string;
    width?: 'full' | 'auto';
}

export default function ScrollReveal({
    children,
    animation = 'fade-in',
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
    className = '',
    width = 'full'
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    const getInitialTransform = () => {
        const normalizedAnimation = animation === 'slideUp' ? 'slide-up' : animation;
        switch (normalizedAnimation) {
            case 'slide-up': return 'translateY(40px)';
            case 'fade-in': default: return 'none';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                width: width === 'full' ? '100%' : 'auto',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'none' : getInitialTransform(),
                transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
                transitionDelay: `${delay}s`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
}
