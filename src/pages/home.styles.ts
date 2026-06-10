// src/pages/home.styles.ts
import styled from 'styled-components';
import { Card, Button } from 'antd';

export const HomeContainer = styled.div`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff; /* Ultra clean white background */
`;

export const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Poppins', sans-serif;
  color: #00009c; /* Signature Navy */
  margin-bottom: 50px;
`;

export const StyledCard = styled(Card)<{ $isAvailable: boolean }>`
  border-radius: 0px; /* Sharp, high-fashion editorial borders */
  overflow: hidden;
  border: 1px solid #e8e8e8;
  box-shadow: none; /* Flat minimalist aesthetic */
  transition: all 0.3s ease;
  opacity: ${props => props.$isAvailable ? 1 : 0.5};

  &:hover {
    border-color: #00009c; /* Highlights border on hover */
  }

  .ant-card-cover img {
    height: 280px;
    object-fit: cover;
    padding: 12px; /* Slight inset look for elegant product photography display */
    background-color: #fafafa;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const CookieTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #00009c; /* Title is Navy */
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PriceTag = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #00009c;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 0px; /* Match structural card square borders */
  background-color: #00009c;
  border-color: #00009c;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  height: 45px;
  letter-spacing: 1px;

  &:hover {
    background-color: #000066 !important; /* Slightly darker shade on click hover */
    border-color: #000066 !important;
    color: #ffffff !important;
  }
`;

export const OutOfStockBadge = styled.div`
  background-color: #e0e0e0;
  color: #666;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;