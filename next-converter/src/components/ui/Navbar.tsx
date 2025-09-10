'use client';

import React, { useState, useEffect } from 'react';
import { theme } from '@/lib/theme';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface NavbarProps {
  logo?: React.ReactNode;
  logoText?: string;
  items?: NavItem[];
  rightContent?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({
    logo,
    logoText = 'Brand',
    items = [],
    rightContent,
    className = '',
    sticky = true,
    transparent = false,
    ...props
  }, ref) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
      if (!sticky) return;

      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [sticky]);

    const navbarStyle: React.CSSProperties = {
      position: sticky ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: theme.layout.headerHeight,
      borderBottom: transparent && !isScrolled 
        ? 'none' 
        : `0.75px solid ${theme.colors.border.glass}`,
      transition: theme.transitions.fast,
      fontFamily: theme.typography.fontFamily.primary,
      ...(transparent && !isScrolled 
        ? { backgroundColor: 'transparent', backdropFilter: 'none' }
        : theme.effects.glassEffect
      ),
    };

    const containerStyle: React.CSSProperties = {
      maxWidth: theme.layout.maxWidth,
      margin: '0 auto',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${theme.spacing.lg}`,
    };

    const logoStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      color: theme.colors.text.logo,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      textDecoration: 'none',
      cursor: 'pointer',
    };

    const navListStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      listStyle: 'none',
      margin: 0,
      padding: 0,
    };

    const mobileNavStyle: React.CSSProperties = {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.glass,
      backdropFilter: theme.effects.backdropBlur,
      border: `0.75px solid ${theme.colors.border.glass}`,
      borderTop: 'none',
      borderRadius: `0 0 ${theme.borderRadius.md} ${theme.borderRadius.md}`,
      padding: theme.spacing.lg,
      display: isMobileMenuOpen ? 'flex' : 'none',
      flexDirection: 'column',
      gap: theme.spacing.md,
    };

    const navLinkStyle: React.CSSProperties = {
      color: theme.colors.text.navigation,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.linear,
      textDecoration: 'none',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.base,
      transition: theme.transitions.fast,
      cursor: 'pointer',
      border: 'none',
      background: 'none',
    };

    const activeNavLinkStyle: React.CSSProperties = {
      ...navLinkStyle,
      color: theme.colors.text.primary,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    };

    const mobileMenuButtonStyle: React.CSSProperties = {
      display: 'none',
      background: 'none',
      border: 'none',
      color: theme.colors.text.primary,
      fontSize: '18px',
      cursor: 'pointer',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.base,
      transition: theme.transitions.fast,
    };

    const rightContentStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    };

    const handleNavClick = (item: NavItem) => {
      if (item.onClick) {
        item.onClick();
      } else if (item.href) {
        window.location.href = item.href;
      }
      setIsMobileMenuOpen(false);
    };

    return (
      <nav
        ref={ref}
        className={className}
        style={navbarStyle}
        {...props}
      >
        <div style={containerStyle}>
          {/* Logo */}
          <div style={logoStyle}>
            {logo || logoText}
          </div>

          {/* Desktop Navigation */}
          <ul style={navListStyle}>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  style={item.active ? activeNavLinkStyle : navLinkStyle}
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      Object.assign(e.currentTarget.style, navLinkStyle);
                    }
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Content & Mobile Menu Button */}
          <div style={rightContentStyle}>
            {rightContent}
            
            {/* Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div style={mobileNavStyle}>
          {items.map((item) => (
            <button
              key={`mobile-${item.id}`}
              style={item.active ? activeNavLinkStyle : navLinkStyle}
              onClick={() => handleNavClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    );
  }
);

Navbar.displayName = 'Navbar';

export default Navbar;