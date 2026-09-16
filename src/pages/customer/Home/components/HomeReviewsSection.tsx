import React, { useMemo } from "react";
import { Rate, Avatar, Spin, Flex, Empty } from "antd";
import type { Review } from "@src/types/review";
import { useMediaQuery } from "@src/hooks/useMediaQuery";
import {
  ReviewsSection,
  ReviewsSectionTitle,
  SectionBadge,
  BestCarousel,
  ReviewSlide,
  ReviewCard,
  ReviewerName,
  ReviewEmail,
  ReviewText,
} from "@src/pages/customer/Home/styles";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&auto=format&fit=crop";

const CAROUSEL_RESPONSIVE_SETTINGS = [
  {
    breakpoint: 1200,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,
      swipe: true,
      draggable: true,
      touchMove: true,
      touchThreshold: 10,
    },
  },
  {
    breakpoint: 992,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
      swipe: true,
      draggable: true,
      touchMove: true,
      touchThreshold: 10,
    },
  },
  {
    breakpoint: 640,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      swipe: true,
      draggable: true,
      touchMove: true,
      touchThreshold: 10,
    },
  },
];

interface HomeReviewsSectionProps {
  reviews: Review[];
  loading: boolean;
  isMobile?: boolean;
}

const HomeReviewsSectionComponent: React.FC<HomeReviewsSectionProps> = ({
  reviews,
  loading,
}) => {
  const isMobileScreen = useMediaQuery("(max-width: 640px)");
  const isTabletScreen = useMediaQuery("(max-width: 992px)");

  const slidesToShow = useMemo(() => {
    if (isMobileScreen) return 1;
    if (isTabletScreen) return Math.min(2, reviews.length);
    return Math.min(4, reviews.length);
  }, [isMobileScreen, isTabletScreen, reviews.length]);

  return (
    <ReviewsSection>
      <ReviewsSectionTitle level={2}>Customer Reviews</ReviewsSectionTitle>
      <SectionBadge>
        ⭐ Real reviews from our happy cookie lovers
      </SectionBadge>

      <Spin spinning={loading}>
        {reviews.length > 0 ? (
          <BestCarousel
            key={`reviews-carousel-${slidesToShow}`}
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            dots={true}
            arrows={!isMobileScreen}
            infinite={reviews.length > 1}
            draggable={true}
            swipe={true}
            touchMove={true}
            touchThreshold={10}
            responsive={CAROUSEL_RESPONSIVE_SETTINGS}
          >
            {reviews.map((review, i) => {
              const name = review.userName || "Verified Customer";
              const avatar = ("userAvatar" in review && review.userAvatar) || DEFAULT_AVATAR;
              const rating = review.rating || 5;
              const comment = review.comment || "Delicious fresh-baked cookies!";

              return (
                <ReviewSlide key={review.id || i}>
                  <ReviewCard>
                    <Flex align="center" gap={12} style={{ minWidth: 0, width: "100%" }}>
                      <Avatar
                        size={42}
                        src={avatar}
                        style={{ background: "#e8eaff", flexShrink: 0, border: "2px solid #e0e7ff" }}
                      />
                      <Flex vertical style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                        <ReviewerName>{name}</ReviewerName>
                        <ReviewEmail>✓ Verified Customer</ReviewEmail>
                      </Flex>
                    </Flex>
                    <Rate
                      disabled
                      value={rating}
                      style={{ fontSize: 13, color: "#faad14" }}
                    />
                    <ReviewText>"{comment}"</ReviewText>
                  </ReviewCard>
                </ReviewSlide>
              );
            })}
          </BestCarousel>
        ) : (
          <Flex justify="center" align="center" style={{ padding: "40px 16px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No customer reviews yet. Order and be the first to share your experience!"
            />
          </Flex>
        )}
      </Spin>
    </ReviewsSection>
  );
};

export const HomeReviewsSection = React.memo(HomeReviewsSectionComponent);
