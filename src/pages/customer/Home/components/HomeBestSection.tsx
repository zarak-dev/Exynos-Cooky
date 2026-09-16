import React from "react";
import { Tag } from "antd";
import type { Cookie } from "../../../../types/product";
import { StyledCard } from "../../../../components/StyledCard";
import { DEFAULT_COOKIE_IMAGE } from "../../../../constants";
import {
  BestSection,
  BestSectionTitle,
  BestCarousel,
  StyledButton,
  BestCoverImage,
  BestCardHeader,
  SectionBadge,
  BestCardSlide,
  BestCardBody,
  StyledMeta,
  BestCardTitle,
} from "../styles";

const CAROUSEL_RESPONSIVE_SETTINGS = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 2,
    },
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
    },
  },
];

interface HomeBestSectionProps {
  cookies: Cookie[];
  onAddToCart: (cookie: Cookie) => void;
  isMobile: boolean;
}

const HomeBestSectionComponent: React.FC<HomeBestSectionProps> = ({
  cookies,
  onAddToCart,
  isMobile,
}) => {
  return (
    <BestSection>
      <BestSectionTitle level={2}>Our Best Products</BestSectionTitle>
      <SectionBadge>
        🍪 Our most loved cookies, picked just for you
      </SectionBadge>
      <BestCarousel
        slidesToShow={4}
        slidesToScroll={2}
        dots={true}
        arrows={!isMobile}
        infinite={cookies.length > 1}
        swipeToSlide={true}
        responsive={CAROUSEL_RESPONSIVE_SETTINGS}
      >
        {cookies.map((cookie) => (
          <BestCardSlide key={cookie.id}>
            <StyledCard
              hoverable
              $isAvailable={cookie.isAvailable}
              cover={
                <BestCoverImage
                  src={cookie.imageUrl || DEFAULT_COOKIE_IMAGE}
                  fallback={DEFAULT_COOKIE_IMAGE}
                  alt={cookie.name}
                  preview={false}
                  loading="lazy"
                />
              }
            >
              <BestCardBody>
                <BestCardHeader>
                  <BestCardTitle level={5}>{cookie.name}</BestCardTitle>
                  <Tag
                    color={cookie.isAvailable ? "blue" : "red"}
                    variant="solid"
                  >
                    {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                  </Tag>
                </BestCardHeader>
                <StyledMeta description={cookie.description} />

                <StyledButton
                  type="primary"
                  shape="round"
                  size="small"
                  disabled={!cookie.isAvailable}
                  danger={!cookie.isAvailable}
                  onClick={() => onAddToCart(cookie)}
                >
                  {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                </StyledButton>
              </BestCardBody>
            </StyledCard>
          </BestCardSlide>
        ))}
      </BestCarousel>
    </BestSection>
  );
};

export const HomeBestSection = React.memo(HomeBestSectionComponent);

