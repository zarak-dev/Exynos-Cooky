import styled from "styled-components";
import { Carousel, Typography, Button, Image, Flex } from "antd";

export const StyledCarousel = styled(Carousel)`
  width: 100%;

  .slick-slide {
    padding: 0 6px;
  }

  .slick-dots {
    bottom: 20px;
  }

  .slick-dots li button {
    background: #b7c4ff;
  }

  .slick-dots li.slick-active button {
    background: #00009c;
  }
`;

export const SlideContainer = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #f8faff 0%, #eef3ff 100%);
  border-radius: 24px;
  overflow: hidden;
  padding: 70px 80px;
`;

export const HeroImage = styled(Image)`
  width: 90%;
  max-width: 560px;
  display: block;
  margin-left: auto;

  img {
    border-radius: 24px;
    object-fit: contain;
  }
`;

export const HeroTitle = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    font-size: 3.4rem;
    line-height: 1.1;
    margin-bottom: 18px;
    font-weight: 800;
  }
`;
export const HeroDescription = styled(Typography.Paragraph)`
  &.ant-typography {
    font-size: 18px;
    color: #666;
    margin-bottom: 32px;
  }
`;

export const Price = styled(Typography.Title)`
  &.ant-typography {
    color: #00009c;
    margin-bottom: 32px;
    font-weight: 700;
  }
`;
export const OrderButton = styled(Button)`
  height: 52px;
  padding-inline: 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
`;
export const HeroContent = styled(Flex)`
  height: 100%;
`;

export const PriceWrapper = styled(Flex)`
  flex-direction: column;
  gap: 2px;
  margin: 12px 0 20px;
`;

export const PriceLabel = styled(Typography.Text)`
  color: #8c8c8c;
  font-size: 14px;
  font-weight: 500;
`;