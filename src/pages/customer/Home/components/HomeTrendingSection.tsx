import React, { useState, useRef } from "react";
import { Tag, Rate } from "antd";
import type { Cookie } from "@src/types/product";
import { StyledTitle } from "@src/components/StyledTitle";
import { DEFAULT_COOKIE_IMAGE } from "@src/constants";
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
} from "@src/pages/customer/Home/styles";

interface HomeTrendingSectionProps {
  cookies: Cookie[];
  onAddToCart: (cookie: Cookie) => void;
}

const HomeTrendingSectionComponent: React.FC<HomeTrendingSectionProps> = ({
  cookies,
  onAddToCart,
}) => {
  const [activeTrending, setActiveTrending] = useState<number>(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = (touchStartY.current || 0) - (touchEndY.current || 0);

    // Only trigger if horizontal swipe was greater than vertical swipe (avoid canceling vertical scroll)
    // and exceeded minimal threshold (35px for snappy response)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX > 0) {
        // Swiped left -> next
        setActiveTrending((prev) => (prev + 1) % cookies.length);
      } else {
        // Swiped right -> prev
        setActiveTrending((prev) => (prev - 1 + cookies.length) % cookies.length);
      }
    }
  };

  return (
    <TrendingSection>
      <TrendingSectionTitle level={2}>Trending</TrendingSectionTitle>
      <SectionBadge>
        🔥 Discover what everyone is ordering right now
      </SectionBadge>
      <TrendingStack
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
                src={cookie.imageUrl || DEFAULT_COOKIE_IMAGE}
                alt={cookie.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_COOKIE_IMAGE;
                }}
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
