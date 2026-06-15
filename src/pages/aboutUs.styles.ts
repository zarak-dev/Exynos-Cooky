// src/pages/aboutUs.styles.ts
import styled from 'styled-components';
import { Card } from 'antd';

export const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  background-color: #ffffff;
  font-family: 'Poppins', sans-serif;
`;

export const EditorialHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

export const StoryTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  color: #00009c;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

export const StoryDivider = styled.div`
  width: 60px;
  height: 4px;
  background-color: #00009c;
  margin: 24px auto;
`;

export const NarrativeBlock = styled.div`
  margin-bottom: 60px;
`;

export const Paragraph = styled.p`
  font-size: 1.1rem;
  color: #333333;
  line-height: 1.8;
  margin-bottom: 24px;
  text-align: justify;
`;

export const HighlightText = styled.span`
  color: #00009c;
  font-weight: 700;
`;

export const CoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled(Card)`
  border-radius: 0px;
  border: 1px solid #e8e8e8;
  box-shadow: none;
  background-color: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00009c;
    background-color: #ffffff;
  }

  .ant-card-head-title {
    color: #00009c;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;