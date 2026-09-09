import styled from "styled-components";
import { Carousel, Typography, Button, Flex } from "antd";

export const StyledCarousel = styled(Carousel)`
  width: 100%;

  .slick-dots {
    bottom: 14px;
  }

  .slick-dots li button {
    background: rgba(0, 0, 156, 0.95);
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .slick-dots li.slick-active button {
    background: #00009c;
  }

  .slick-slide > div {
    height: 100%;
  }
`;

export const SlideContainer = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  overflow: hidden;
  box-sizing: border-box;

  @media (min-width: 993px) {
    height: 520px;
    display: flex !important;
    align-items: center;
    padding: 0 80px;
  }

  @media (max-width: 992px) {
    padding: 32px 24px 44px;
    display: block !important;
  }

  @media (max-width: 576px) {
    padding: 20px 14px 36px;
    display: block !important;

    .ant-row {
      flex-direction: column-reverse;
      margin-left: 0 !important;
      margin-right: 0 !important;
      width: 100% !important;
      row-gap: 12px !important;
    }

    .ant-col {
      padding-left: 0 !important;
      padding-right: 0 !important;
      width: 100% !important;
    }
  }
`;

export const HeroContent = styled(Flex)`
  width: 100%;

  @media (min-width: 993px) {
    height: 100%;
    flex: 1;
  }

  @media (max-width: 576px) {
    align-items: center;
    text-align: center;
  }
`;

export const HeroTitle = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    font-size: 3rem;
    line-height: 1.15;
    margin-bottom: 12px;
    font-weight: 800;

    @media (max-width: 992px) {
      font-size: 2rem;
    }
    @media (max-width: 576px) {
      font-size: 1.45rem;
      text-align: center;
      margin-bottom: 8px;
    }
    @media (max-width: 380px) {
      font-size: 1.3rem;
    }
  }
`;

export const HeroDescription = styled(Typography.Paragraph)`
  &.ant-typography {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;

    @media (max-width: 992px) {
      font-size: 14px;
      margin-bottom: 12px;
    }
    @media (max-width: 576px) {
      font-size: 13px;
      text-align: center;
      margin-bottom: 8px;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

export const PriceWrapper = styled(Flex)`
  flex-direction: column;
  gap: 2px;
  margin: 8px 0 16px;

  @media (max-width: 576px) {
    align-items: center;
    margin: 2px 0 12px;
  }
`;

export const PriceLabel = styled(Typography.Text)`
  color: #8c8c8c;
  font-size: 13px;
  font-weight: 500;
`;

export const Price = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    margin-bottom: 0;
    font-weight: 700;

    @media (max-width: 992px) {
      font-size: 1.4rem !important;
    }
    @media (max-width: 576px) {
      font-size: 1.25rem !important;
    }
  }
`;

export const OrderButton = styled(Button)`
  height: 48px;
  padding-inline: 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;

  @media (max-width: 992px) {
    height: 42px;
    padding-inline: 24px;
    font-size: 14px;
  }

  @media (max-width: 576px) {
    height: 42px;
    padding-inline: 28px;
    font-size: 14px;
    min-width: 140px;
  }
`;

export const ImageWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 576px) {
    width: 100%;
    height: 170px;
    margin: 4px 0;
  }
  @media (max-width: 380px) {
    height: 150px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 20px;

  @media (max-width: 992px) {
    max-height: 280px;
  }
  @media (max-width: 576px) {
    max-height: 170px;
    max-width: 250px;
    border-radius: 16px;
  }
  @media (max-width: 380px) {
    max-height: 150px;
    max-width: 220px;
  }
`;
