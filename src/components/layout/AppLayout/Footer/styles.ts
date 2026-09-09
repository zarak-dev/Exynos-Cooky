import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const StyledFooter = styled.footer`
  background-color: #00009c;
  padding: 60px 40px 28px 40px;
  margin-top: auto;
  position: relative;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;

  @media (max-width: 576px) {
    padding: 40px 18px 24px 18px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
`;

export const LogoImage = styled.img`
  width: 125px;
  border-radius: 8px;
  margin-left: 38px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
  @media (max-width: 480px) {
    width: 110px;
  }
`;
export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FooterBrand = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

export const FooterHeading = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

export const FooterLink = styled(NavLink)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;
