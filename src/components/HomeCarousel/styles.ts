import styled from "styled-components";
import { Carousel, Typography, Button, Flex } from "antd";

export const StyledCarousel = styled(Carousel)`
  width: 100%;

  .slick-dots {
    bottom: 14px;
  }

  .slick-dots li button {
    background: #b7c4ff;
  }

  .slick-dots li.slick-active button {
    background: #00009c;
  }

  /* Force every slide to the same height */
  .slick-slide > div {
    height: 100%;
  }
`;

export const SlideContainer = styled.div`
  width: 100%;
  height: 520px;
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  overflow: hidden;
  display: flex !important;
  align-items: center;
  padding: 0 80px;
  box-sizing: border-box;

  @media (max-width: 992px) {
    height: 340px;
    padding: 0 24px;
  }

  @media (max-width: 576px) {
    height: auto;
    padding: 32px 20px;
    flex-direction: column;
  }
`;

export const HeroContent = styled(Flex)`
  height: 100%;
  flex: 1;
`;

export const HeroTitle = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    font-size: 3rem;
    line-height: 1.1;
    margin-bottom: 12px;
    font-weight: 800;

    @media (max-width: 992px) {
      font-size: 1.8rem;
    }
  }
`;

export const HeroDescription = styled(Typography.Paragraph)`
  &.ant-typography {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;

    @media (max-width: 992px) {
      font-size: 13px;
      margin-bottom: 12px;
    }
  }
`;

export const PriceWrapper = styled(Flex)`
  flex-direction: column;
  gap: 2px;
  margin: 8px 0 16px;
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
  }
`;

export const OrderButton = styled(Button)`
  height: 48px;
  padding-inline: 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;

  @media (max-width: 992px) {
    height: 38px;
    padding-inline: 20px;
    font-size: 13px;
  }
`;

/* Image side — fixed height, cover crop so all images look identical */
export const ImageWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 576px) {
    width: 100%;
    height: 200px;
    margin-top: 20px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 20px;

  @media (max-width: 992px) {
    max-height: 260px;
  }
`;