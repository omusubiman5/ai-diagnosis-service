'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    animation?: 'fade-in' | 'slide-up' | 'slideUp' | 'scale-up';
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
    duration = 0.9,
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
            case 'scale-up': return 'scale(0.95)';
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
                transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${delay}s`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
}
