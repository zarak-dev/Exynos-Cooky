import React from "react";
import { Col, Row } from "antd";

import {
  HeroContent,
  HeroDescription,
  HeroImage,
  HeroTitle,
  ImageWrapper,
  OrderButton,
  Price,
  PriceActionRow,
  PriceContainer,
  PriceLabel,
  SlideContainer,
  StyledCarousel,
} from "./styles";
import type { Cookie } from "@src/types";
import { DEFAULT_COOKIE_IMAGE } from "@src/constants";

interface HomeCarouselProps {
  cookies: Cookie[];
  onAdd: (cookie: Cookie) => void;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({ cookies, onAdd }) => {
  return (
    <StyledCarousel
      autoplay
      autoplaySpeed={4000}
      infinite
      draggable
      swipe
      touchMove
      swipeToSlide
      touchThreshold={10}
    >
      {cookies.map((cookie) => (
        <SlideContainer key={cookie.id}>
          <Row
            align="middle"
            gutter={[32, 24]}
            style={{ width: "100%" }}
          >
            <Col xs={24} md={12}>
              <HeroContent vertical justify="center">
                <HeroTitle level={1}>{cookie.name}</HeroTitle>
                <HeroDescription>{cookie.description}</HeroDescription>
                <PriceContainer>
                  <PriceLabel>Starting from</PriceLabel>
                  <PriceActionRow align="center">
                    <Price>Rs {cookie.price.toLocaleString()}</Price>
                    <OrderButton type="primary" onClick={() => onAdd(cookie)}>
                      Add to Box
                    </OrderButton>
                  </PriceActionRow>
                </PriceContainer>
              </HeroContent>
            </Col>

            <Col xs={24} md={12}>
              <ImageWrapper>
                <HeroImage
                  src={cookie.imageUrl || DEFAULT_COOKIE_IMAGE}
                  alt={cookie.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_COOKIE_IMAGE;
                  }}
                />
              </ImageWrapper>
            </Col>
          </Row>
        </SlideContainer>
      ))}
    </StyledCarousel>
  );
};

export default React.memo(HomeCarousel);
