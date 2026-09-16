import React from "react";
import { Rate, Avatar, Spin, Flex, Empty } from "antd";
import type { Review } from "../../../../types/review";
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
} from "../styles";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&auto=format&fit=crop";

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

interface HomeReviewsSectionProps {
  reviews: Review[];
  loading: boolean;
  isMobile: boolean;
}

const HomeReviewsSectionComponent: React.FC<HomeReviewsSectionProps> = ({
  reviews,
  loading,
  isMobile,
}) => {
  return (
    <ReviewsSection>
      <ReviewsSectionTitle level={2}>Customer Reviews</ReviewsSectionTitle>
      <SectionBadge>
        ⭐ Real reviews from our happy cookie lovers
      </SectionBadge>

      <Spin spinning={loading}>
        {reviews.length > 0 ? (
          <BestCarousel
            slidesToShow={Math.min(4, reviews.length)}
            slidesToScroll={1}
            dots={true}
            arrows={!isMobile}
            infinite={reviews.length > 1}
            swipeToSlide={true}
            responsive={CAROUSEL_RESPONSIVE_SETTINGS}
          >
            {reviews.map((review, i) => {
              const name = review.userName || "Verified Customer";
              const avatar = ("userAvatar" in review && review.userAvatar) || DEFAULT_AVATAR;
              const email = review.userEmail || "";
              const rating = review.rating || 5;
              const comment = review.comment || "Delicious fresh-baked cookies!";

              return (
                <ReviewSlide key={review.id || i}>
                  <ReviewCard>
                    <Flex align="center" gap={10} style={{ minWidth: 0, width: "100%" }}>
                      <Avatar
                        size={40}
                        src={avatar}
                        style={{ background: "#e8eaff", flexShrink: 0 }}
                      />
                      <Flex vertical style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                        <ReviewerName>{name}</ReviewerName>
                        {email && <ReviewEmail>{email}</ReviewEmail>}
                      </Flex>
                    </Flex>
                    <Rate
                      disabled
                      value={rating}
                      style={{ fontSize: 12, color: "#faad14" }}
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

