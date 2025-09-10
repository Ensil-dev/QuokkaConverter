'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import Typography from './Typography';

export interface FooterLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo?: React.ReactNode;
  logoText?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: FooterLink[];
  copyright?: string;
  className?: string;
  minimal?: boolean;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({
    logo,
    logoText = 'Brand',
    description,
    sections = [],
    socialLinks = [],
    copyright,
    className = '',
    minimal = false,
    ...props
  }, ref) => {
    const footerStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background.secondary,
      borderTop: `1px solid ${theme.colors.border.primary}`,
      fontFamily: theme.typography.fontFamily.primary,
      marginTop: 'auto',
    };

    const containerStyle: React.CSSProperties = {
      maxWidth: theme.layout.maxWidth,
      margin: '0 auto',
      padding: minimal 
        ? `${theme.spacing['2xl']} ${theme.spacing.xl}`
        : `${theme.spacing['4xl']} ${theme.spacing.xl} ${theme.spacing['2xl']}`,
    };

    const mainContentStyle: React.CSSProperties = {
      display: minimal ? 'flex' : 'grid',
      gridTemplateColumns: minimal ? undefined : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: minimal ? theme.spacing.xl : theme.spacing['2xl'],
      marginBottom: minimal ? 0 : theme.spacing['3xl'],
      alignItems: minimal ? 'center' : 'flex-start',
      flexDirection: minimal ? 'row' : undefined,
      flexWrap: 'wrap',
    };

    const brandSectionStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
      flex: minimal ? '1' : undefined,
    };

    const logoStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      color: theme.colors.text.logo,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      marginBottom: theme.spacing.sm,
    };

    const linksSectionStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
    };

    const sectionTitleStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    };

    const linkStyle: React.CSSProperties = {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.sm,
      textDecoration: 'none',
      transition: theme.transitions.fast,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '2px 0',
      textAlign: 'left' as const,
    };

    const socialLinksStyle: React.CSSProperties = {
      display: 'flex',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    };

    const socialLinkStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: theme.borderRadius.base,
      backgroundColor: 'transparent',
      border: `1px solid ${theme.colors.border.primary}`,
      color: theme.colors.text.secondary,
      textDecoration: 'none',
      transition: theme.transitions.fast,
      cursor: 'pointer',
    };

    const bottomSectionStyle: React.CSSProperties = {
      paddingTop: theme.spacing.xl,
      borderTop: `1px solid ${theme.colors.border.primary}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: theme.spacing.md,
    };

    const copyrightStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    };

    const handleLinkClick = (link: FooterLink) => {
      if (link.onClick) {
        link.onClick();
      } else if (link.href) {
        window.location.href = link.href;
      }
    };

    return (
      <footer
        ref={ref}
        className={className}
        style={footerStyle}
        {...props}
      >
        <div style={containerStyle}>
          <div style={mainContentStyle}>
            {/* Brand Section */}
            <div style={brandSectionStyle}>
              <div style={logoStyle}>
                {logo || logoText}
              </div>
              {description && !minimal && (
                <Typography variant="body" color="secondary" style={{ margin: 0, fontSize: theme.typography.fontSize.sm }}>
                  {description}
                </Typography>
              )}
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div style={socialLinksStyle}>
                  {socialLinks.map((link) => (
                    <button
                      key={link.id}
                      style={socialLinkStyle}
                      onClick={() => handleLinkClick(link)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                        e.currentTarget.style.borderColor = theme.colors.border.secondary;
                        e.currentTarget.style.color = theme.colors.text.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = theme.colors.border.primary;
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Links Sections */}
            {!minimal && sections.map((section) => (
              <div key={section.id} style={linksSectionStyle}>
                <h3 style={sectionTitleStyle}>{section.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                  {section.links.map((link) => (
                    <button
                      key={link.id}
                      style={linkStyle}
                      onClick={() => handleLinkClick(link)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.text.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          {copyright && (
            <div style={bottomSectionStyle}>
              <div style={copyrightStyle}>
                {copyright}
              </div>
              {minimal && socialLinks.length > 0 && (
                <div style={socialLinksStyle}>
                  {socialLinks.map((link) => (
                    <button
                      key={link.id}
                      style={socialLinkStyle}
                      onClick={() => handleLinkClick(link)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                        e.currentTarget.style.borderColor = theme.colors.border.secondary;
                        e.currentTarget.style.color = theme.colors.text.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = theme.colors.border.primary;
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;