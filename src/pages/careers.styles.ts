// src/pages/careers.styles.ts
import styled from 'styled-components';
import { Card, Button, Collapse } from 'antd';

export const CareersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
`;

export const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #00009c;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #00009c;
  text-transform: uppercase;
  margin-bottom: 32px;
  letter-spacing: 0.5px;
`;

export const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ValueCard = styled(Card)`
  border-radius: 0px;
  border: 1px solid #e8e8e8;
  box-shadow: none;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #00009c;
  }

  .ant-card-head-title {
    color: #00009c;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1rem;
  }
`;

export const JobCollapse = styled(Collapse)`
  background: transparent !important;
  border: none !important;

  .ant-collapse-item {
    border-bottom: 1px solid #e8e8e8 !important;
    margin-bottom: 16px;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    
    &:hover {
      border-color: #00009c;
    }
  }

  .ant-collapse-header {
    align-items: center !important;
    padding: 20px !important;
  }

  .ant-collapse-header-text {
    font-weight: 700;
    color: #00009c !important;
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 24px;
  }
  
  .ant-collapse-content {
    background: #ffffff !important;
    border-top: 1px solid #e8e8e8 !important;
  }
`;

export const JobMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 4px;
`;

export const ApplyButton = styled(Button)`
  border-radius: 0px;
  background-color: #00009c;
  border-color: #00009c;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  height: 40px;
  margin-top: 16px;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #000066 !important;
    border-color: #000066 !important;
    color: #ffffff !important;
  }
`;