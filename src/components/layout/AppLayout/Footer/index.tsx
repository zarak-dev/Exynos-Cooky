import React from 'react';
import logoSvg from '../../../../assets/images/exynos-cooky.svg';
import {
  StyledFooter,
  FooterGrid,
  FooterColumn,
  FooterBrand,
  LogoImage,
  FooterText,
  FooterHeading,
  FooterLink,
  CopyrightBar,
  PolicyLinksWrapper
} from './styles';

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterGrid>
        {/* Column 1: Brand details */}
        <FooterColumn>
          <FooterBrand>
            <LogoImage src={logoSvg} alt="Exynos Cooky Logo" /> 
          </FooterBrand>
          <FooterText>
            Bringing premium, freshly baked cookies directly to your screen. The ultimate cookie experience.
          </FooterText>
        </FooterColumn>

        {/* Column 2: Quick Explore links */}
        <FooterColumn>
          <FooterHeading>Explore</FooterHeading>
          <FooterLink to="/">Weekly Menu</FooterLink>
          <FooterLink to="/about">Our Story</FooterLink>
          <FooterLink to="/track-order">Track Order</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
        </FooterColumn>

        {/* Column 3: Corporate/Gifting links */}
        <FooterColumn>
          <FooterHeading>Services</FooterHeading>
          <FooterLink to="#">Nationwide Shipping</FooterLink>
          <FooterLink to="#">Corporate Gifting</FooterLink>
          <FooterLink to="#">Catering</FooterLink>
          <FooterLink to="#">Franchising</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterHeading>Support</FooterHeading>
          <FooterText>Email: support@exynoscooky.com</FooterText>
          <FooterText>Phone: +92 (051) 123-4567</FooterText>
        </FooterColumn>
      </FooterGrid>

      <CopyrightBar>
        <FooterText>© 2026 Exynos Cooky. All rights reserved.</FooterText>
        <PolicyLinksWrapper>
          <FooterLink to="#">Privacy Policy</FooterLink>
          <FooterLink to="#">Terms of Service</FooterLink>
        </PolicyLinksWrapper>
      </CopyrightBar>
    </StyledFooter>
  );
};

export default Footer;