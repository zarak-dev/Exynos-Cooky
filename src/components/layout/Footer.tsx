// src/components/layout/footer.tsx
import React from 'react';
import logoSvg from '../../assets/images/exynos-cooky.svg';
import {
  StyledFooter,
  FooterGrid,
  FooterColumn,
  FooterBrand,
  FooterText,
  FooterHeading,
  FooterLink,
  CopyrightBar
} from './footer.styles';

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterGrid>
        {/* Column 1: Brand details */}
        <FooterColumn>
          <FooterBrand> <img src={logoSvg} alt="logo" style={{width:'225px'}} /> </FooterBrand>
          <FooterText>
            Bringing premium, freshly baked cookies directly to your screen. The ultimate cookie experience.
          </FooterText>
        </FooterColumn>

        {/* Column 2: Quick Explore links */}
        <FooterColumn>
          <FooterHeading>Explore</FooterHeading>
          <FooterLink to="/">Weekly Menu</FooterLink>
          <FooterLink to="/about">Our Story</FooterLink>
          <FooterLink to="/delivery">Local Delivery</FooterLink>
          <FooterLink to="/contact">Careers</FooterLink>
        </FooterColumn>

        {/* Column 3: Corporate/Gifting links */}
        <FooterColumn>
          <FooterHeading>Services</FooterHeading>
          <FooterLink to="#">Nationwide Shipping</FooterLink>
          <FooterLink to="#">Corporate Gifting</FooterLink>
          <FooterLink to="#">Catering</FooterLink>
          <FooterLink to="#">Franchising</FooterLink>
        </FooterColumn>

        {/* Column 4: Customer Support info */}
        <FooterColumn>
          <FooterHeading>Support</FooterHeading>
          <FooterText>Email: support@exynoscooky.com</FooterText>
          <FooterText>Phone: +92 (051) 123-4567</FooterText>
        </FooterColumn>
      </FooterGrid>

      {/* Copyright footer segment */}
      <CopyrightBar>
        <FooterText>© 2026 Exynos Cooky. All rights reserved.</FooterText>
        <div style={{ display: 'flex', gap: '20px' }}>
          <FooterLink to="#">Privacy Policy</FooterLink>
          <FooterLink to="#">Terms of Service</FooterLink>
        </div>
      </CopyrightBar>
    </StyledFooter>
  );
};

export default Footer;