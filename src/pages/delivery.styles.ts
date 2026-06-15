// src/pages/delivery.styles.ts
import styled from 'styled-components';
import { Button, Input, List } from 'antd';

export const DeliveryPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  min-height: 50vh;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActiveSelectionBanner = styled.div`
  text-align: center;
  max-width: 600px;
  width: 100%;
  padding: 40px;
  border: 1px solid #e8e8e8;
  background-color: #ffffff;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #00009c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 24px;
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

export const ChoiceCard = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#00009c' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#00009c'};
  border: 2px solid #00009c;
  height: 80px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#000066' : '#f4f6ff'};
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  border: 2px solid #00009c;
  width: 100%;
  height: 50px;
  margin-top: 16px;
`;

export const StyledInput = styled(Input)`
  border: none !important;
  border-radius: 0px !important;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
  padding-left: 16px;
  flex: 1;

  &:focus, &:hover {
    box-shadow: none !important;
  }
`;

export const PrimaryActionBtn = styled(Button)`
  height: 100% !important;
  border: none !important;
  border-radius: 0px !important;
  background-color: #00009c !important;
  color: #ffffff !important;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0 24px;
  font-size: 0.9rem;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #000066 !important;
  }
`;

export const StoreList = styled(List)`
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  
  .ant-list-item {
    padding: 12px 16px !important;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'Poppins', sans-serif;

    &:hover {
      background: #f4f6ff;
    }
  }
`;

export const StoreName = styled.div`
  font-weight: 700;
  color: #00009c;
  font-size: 0.95rem;
`;

export const StoreAddress = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
`;