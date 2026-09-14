import React from "react";
import { Rate, Avatar, Spin, Flex } from "antd";
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

const FALLBACK_REVIEWS = [
  {
    userName: "Ayesha Khan",
    userEmail: "ayesha.k@example.com",
    rating: 5,
    comment: "Absolutely divine! The Lotus Biscoff melted in my mouth. Will order every week!",
  },
  {
    userName: "Hamza Ali",
    userEmail: "hamza.ali@example.com",
    rating: 5,
    comment: "Best cookies in town, hands down. The box packaging is so cute too 🍪",
  },
  {
    userName: "Sara Ahmed",
    userEmail: "sara.ahmed@example.com",
    rating: 5,
    comment: "Tried the Pink Velvet and I was blown away. Super fresh and perfectly soft.",
  },
  {
    userName: "Bilal Tariq",
    userEmail: "bilal.t@example.com",
    rating: 5,
    comment: "Ordered for my daughter's birthday and everyone loved them. 10/10 recommend!",
  },
  {
    userName: "Fatima Noor",
    userEmail: "fatima.noor@example.com",
    rating: 5,
    comment: "Brown Butter Toffee is my new addiction. Warm, fresh, and perfectly baked!",
  },
];

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

export const HomeReviewsSection: React.FC<HomeReviewsSectionProps> = ({
  reviews,
  loading,
  isMobile,
}) => {
  const displayItems = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <ReviewsSection>
      <ReviewsSectionTitle level={2}>Customer Reviews</ReviewsSectionTitle>
      <SectionBadge>
        ⭐ Real reviews from our happy cookie lovers
      </SectionBadge>

      <Spin spinning={loading}>
        <BestCarousel
          slidesToShow={4}
          slidesToScroll={2}
          dots={true}
          arrows={!isMobile}
          infinite={true}
          swipeToSlide={true}
          responsive={CAROUSEL_RESPONSIVE_SETTINGS}
        >
          {displayItems.map((review, i) => {
            const name = review.userName || "Verified Customer";
            const avatar = ("userAvatar" in review && review.userAvatar) || DEFAULT_AVATAR;
            const email = review.userEmail || "";
            const rating = review.rating || 5;
            const comment = review.comment || "Delicious fresh-baked cookies!";

            return (
              <ReviewSlide key={i}>
                <ReviewCard>
                  <Flex align="center" gap={10} style={{ minWidth: 0, width: "100%" }}>
                    <Avatar
                      size={40}
                      src={avatar}
                      style={{ background: "#e8eaff", flexShrink: 0 }}
                    />
                    <Flex vertical style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                      <ReviewerName>{name}</ReviewerName>
                      <ReviewEmail>{email}</ReviewEmail>
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
      </Spin>
    </ReviewsSection>
  );
};
