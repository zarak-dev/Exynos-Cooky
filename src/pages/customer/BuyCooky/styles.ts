import styled from "styled-components";
import { Flex, Modal, Typography } from "antd";
import { StyledCard } from "../../../components/StyledCard";

export const PageLayout = styled(Flex)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px 16px;
  }
`;

export const MainContent = styled(Flex)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 576px) {
    padding: 24px 14px;
    gap: 16px;
  }
`;

export const LoadMoreWrapper = styled(Flex)`
  justify-content: center;
  padding-top: 16px;
`;
export const EqualCard = styled(StyledCard)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const CardFooter = styled(Flex)`
  margin-top: auto;
  flex-direction: column;
  gap: 8px;
`;

export const FilterBar = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    .ant-select {
      width: 100% !important;
    }
  }
`;

export const FilterGroup = styled(Flex)`
  gap: 8px;
  align-items: center;

  @media (max-width: 576px) {
    width: 100%;

    .ant-select {
      flex: 1;
    }
  }
`;

export const StyledDetailModal = styled(Modal)`
  max-width: calc(100vw - 24px);

  .ant-modal-content {
    border-radius: 20px;
    padding: 24px !important;
    overflow: hidden;
    box-shadow: 0 20px 48px rgba(0, 0, 80, 0.12);

    @media (max-width: 768px) {
      padding: 20px 16px 16px !important;
      border-radius: 18px;
    }
  }

  .ant-modal-close {
    top: 14px;
    right: 14px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    transition: all 0.2s ease;
    z-index: 20;

    &:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    @media (max-width: 768px) {
      top: 12px;
      right: 12px;
      width: 30px;
      height: 30px;
    }
  }
`;

export const ModalBodyWrapper = styled(Flex)`
  gap: 24px;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const ModalLeft = styled.div`
  width: 270px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ModalImageContainer = styled.div`
  width: 100%;
  height: 310px;
  border-radius: 16px;
  overflow: hidden;
  background: #f8fafc;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    height: 210px;
    border-radius: 14px;
  }
`;

export const ModalRight = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 4px 0;

  @media (max-width: 768px) {
    padding: 0;
    gap: 16px;
  }
`;

export const ModalCookieName = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    font-weight: 800;
    margin: 0;
    font-size: 1.55rem;
    line-height: 1.25;

    @media (max-width: 768px) {
      font-size: 1.3rem !important;
      padding-right: 28px;
    }
  }
`;

export const StatusBadge = styled.div<{ $isAvailable?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  background: ${({ $isAvailable }) => ($isAvailable ? "#ecfdf5" : "#fef2f2")};
  color: ${({ $isAvailable }) => ($isAvailable ? "#059669" : "#dc2626")};
  border: 1px solid ${({ $isAvailable }) => ($isAvailable ? "#a7f3d0" : "#fecaca")};

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $isAvailable }) => ($isAvailable ? "#10b981" : "#ef4444")};
    box-shadow: 0 0 6px ${({ $isAvailable }) => ($isAvailable ? "#10b981" : "#ef4444")};
  }
`;

export const StockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
`;

export const FreshnessNotice = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
`;

export const ModalActions = styled(Flex)`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

// Backwards-compatible aliases
export const ModalImage = ModalImageContainer;
export const BlinkingTag = StatusBadge;
