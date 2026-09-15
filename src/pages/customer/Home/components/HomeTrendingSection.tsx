import React, { useState } from "react";
import { Tag, Rate } from "antd";
import type { Cookie } from "../../../../types/product";
import { StyledTitle } from "../../../../components/StyledTitle";
import {
  TrendingSection,
  TrendingSectionTitle,
  TrendingStack,
  TrendingCard,
  TrendingCardHeader,
  TrendingDots,
  TrendingDot,
  SectionBadge,
  TrendingCardBody,
  TrendingMeta,
  StyledButton,
} from "../styles";

interface HomeTrendingSectionProps {
  cookies: Cookie[];
  onAddToCart: (cookie: Cookie) => void;
}

const HomeTrendingSectionComponent: React.FC<HomeTrendingSectionProps> = ({
  cookies,
  onAddToCart,
}) => {
  const [activeTrending, setActiveTrending] = useState<number>(0);

  return (
    <TrendingSection>
      <TrendingSectionTitle level={2}>Trending</TrendingSectionTitle>
      <SectionBadge>
        🔥 Discover what everyone is ordering right now
      </SectionBadge>
      <TrendingStack>
        {cookies.map((cookie, idx) => {
          const pos: "center" | "left" | "right" =
            idx === activeTrending
              ? "center"
              : idx === (activeTrending + 1) % 3
                ? "right"
                : "left";

          return (
            <TrendingCard
              key={cookie.id}
              $pos={pos}
              $isActiveMobile={idx === activeTrending}
              onClick={() => setActiveTrending(idx)}
            >
              <img
                src={cookie.imageUrl}
                alt={cookie.name}
                loading="lazy"
                decoding="async"
              />
              <TrendingCardBody>
                <TrendingCardHeader>
                  <StyledTitle level={5}>{cookie.name}</StyledTitle>
                  <Tag
                    color={cookie.isAvailable ? "blue" : "red"}
                    variant="solid"
                  >
                    {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                  </Tag>
                </TrendingCardHeader>
                <Rate
                  disabled
                  defaultValue={5}
                  style={{ fontSize: 11, color: "#faad14" }}
                />
                <TrendingMeta description={cookie.description} />
                <StyledButton
                  type="primary"
                  shape="round"
                  size="small"
                  disabled={!cookie.isAvailable}
                  danger={!cookie.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(cookie);
                  }}
                >
                  {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                </StyledButton>
              </TrendingCardBody>
            </TrendingCard>
          );
        })}
      </TrendingStack>
      {cookies.length > 1 && (
        <TrendingDots>
          {cookies.map((cookie, idx) => (
            <TrendingDot
              key={cookie.id}
              $active={activeTrending === idx}
              onClick={() => setActiveTrending(idx)}
              aria-label={`View ${cookie.name}`}
            />
          ))}
        </TrendingDots>
      )}
    </TrendingSection>
  );
};

export const HomeTrendingSection = React.memo(HomeTrendingSectionComponent);

