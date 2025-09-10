'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { theme } from '@/lib/theme';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
  image?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  infinite?: boolean;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({
    items,
    className = '',
    autoPlay = false,
    autoPlayInterval = 3000,
    showDots = true,
    showArrows = true,
    infinite = true,
    ...props
  }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = useCallback(() => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      
      if (infinite) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
      }
    }, [items.length, infinite, isTransitioning]);

    const prevSlide = useCallback(() => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      
      if (infinite) {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }, [items.length, infinite, isTransitioning]);

    const goToSlide = useCallback((index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
    }, [isTransitioning]);

    // Auto play functionality
    useEffect(() => {
      if (!autoPlay) return;
      
      const interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, nextSlide]);

    // Handle transition end
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, parseInt(theme.transitions.fast.replace(/[^0-9]/g, '')));

      return () => clearTimeout(timer);
    }, [currentIndex]);

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.primary}`,
    };

    const sliderStyle: React.CSSProperties = {
      display: 'flex',
      transform: `translateX(-${currentIndex * 100}%)`,
      transition: theme.transitions.fast,
      width: `${items.length * 100}%`,
    };

    const slideStyle: React.CSSProperties = {
      width: `${100 / items.length}%`,
      flexShrink: 0,
    };

    const arrowBaseStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '40px',
      height: '40px',
      borderRadius: theme.borderRadius.full,
      border: 'none',
      backgroundColor: theme.colors.background.glass,
      backdropFilter: theme.effects.backdropBlur,
      color: theme.colors.text.primary,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: theme.typography.fontWeight.medium,
      transition: theme.transitions.fast,
      zIndex: 2,
      opacity: 0.8,
    };

    const prevArrowStyle: React.CSSProperties = {
      ...arrowBaseStyle,
      left: theme.spacing.md,
    };

    const nextArrowStyle: React.CSSProperties = {
      ...arrowBaseStyle,
      right: theme.spacing.md,
    };

    const dotsContainerStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: theme.spacing.md,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: theme.spacing.sm,
      zIndex: 2,
    };

    const dotStyle: React.CSSProperties = {
      width: '8px',
      height: '8px',
      borderRadius: theme.borderRadius.full,
      border: 'none',
      cursor: 'pointer',
      transition: theme.transitions.fast,
      backgroundColor: theme.colors.text.tertiary,
    };

    const activeDotStyle: React.CSSProperties = {
      ...dotStyle,
      backgroundColor: theme.colors.accent.primary,
      transform: 'scale(1.2)',
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        {...props}
      >
        <div style={sliderStyle}>
          {items.map((item, index) => (
            <div key={item.id} style={slideStyle}>
              {item.content}
            </div>
          ))}
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button
              style={prevArrowStyle}
              onClick={prevSlide}
              disabled={!infinite && currentIndex === 0}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background.glass;
                e.currentTarget.style.opacity = '0.8';
              }}
            >
              ←
            </button>
            <button
              style={nextArrowStyle}
              onClick={nextSlide}
              disabled={!infinite && currentIndex === items.length - 1}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background.glass;
                e.currentTarget.style.opacity = '0.8';
              }}
            >
              →
            </button>
          </>
        )}

        {showDots && items.length > 1 && (
          <div style={dotsContainerStyle}>
            {items.map((_, index) => (
              <button
                key={index}
                style={index === currentIndex ? activeDotStyle : dotStyle}
                onClick={() => goToSlide(index)}
                onMouseEnter={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = theme.colors.text.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = theme.colors.text.tertiary;
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';

export default Carousel;