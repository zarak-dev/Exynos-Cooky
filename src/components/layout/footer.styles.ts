import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const StyledFooter = styled.footer`
  background-color: #ffffff;
  border-top: 1px solid #f0f0f0;
  padding: 60px 40px 20px 40px;
  margin-top: auto; /* Ensures footer stays pinned to bottom */
`;

export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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
  color: #00009c;
  font-family: 'Poppins', sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FooterText = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

export const FooterHeading = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: #00009c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

export const FooterLink = styled(NavLink)`
  color: #555;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #00009c;
  }
`;

export const CopyrightBar = styled.div`
  max-width: 1200px;
  margin: 40px auto 0 auto;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;