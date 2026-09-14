import React, { useState, useEffect, useMemo } from "react";
import { Tag, message, Rate, Avatar, Spin, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewUsers } from "../../../store/slices/reviewSlice";
import { type Cookie, COOKIE_MOCK_DATA } from "../../../utils/mockData";
import { type RootState } from "../../../store";
import HomeCarousel from "./components/HomeCarousel";
import { StyledCard } from "../../../components/StyledCard";
import { StyledTitle } from "../../../components/StyledTitle";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

import {
  BestSection,
  BestSectionTitle,
  BestCarousel,
  StyledButton,
  BestCoverImage,
  BestCardHeader,
  TrendingSection,
  TrendingSectionTitle,
  TrendingStack,
  TrendingCard,
  TrendingCardHeader,
  TrendingDots,
  TrendingDot,
  ReviewsSection,
  ReviewsSectionTitle,
  ReviewCard,
  ReviewText,
  ReviewerName,
  ReviewEmail,
  SectionBadge,
  BestCardSlide,
  BestCardBody,
  TrendingCardBody,
  TrendingMeta,
  ReviewSlide,
  StyledMeta,
  BestCardTitle,
} from "./styles";
import { addCookieWithFeedback } from "../../../utils/cartActions";

const BEST_COOKIE_IDS = [2, 3, 6, 9, 10, 4];
const TRENDING_CANDIDATE_IDS = [13, 17, 18, 3, 6, 8, 2, 7];
const REVIEWS = [
  {
    comment:
      "Absolutely divine! The Lotus Biscoff melted in my mouth. Will order every week!",
  },
  {
    comment:
      "Best cookies in town, hands down. The box packaging is so cute too 🍪",
  },
  {
    comment:
      "Tried the Pink Velvet and I was blown away. Super fresh and perfectly soft.",
  },
  {
    comment:
      "Ordered for my daughter's birthday and everyone loved them. 10/10 recommend!",
  },
  {
    comment:
      "Fast delivery, gorgeous packaging, and insane flavors. Exynos Cooky is the real deal.",
  },
  {
    comment:
      "The S'mores cookie is absolutely unreal. Never tasted anything like it!",
  },
  {
    comment:
      "My whole family is obsessed. We order a box every single week now.",
  },
  {
    comment:
      "Gifted a box to my colleague and she immediately placed her own order.",
  },
  {
    comment:
      "The cookies arrived fresh and perfectly packed. Genuinely impressed!",
  },
  {
    comment:
      "Cinnamon Roll cookie is a masterpiece. Warm, soft, and perfectly spiced.",
  },
  {
    comment:
      "I've tried many cookie brands but Exynos Cooky is on another level.",
  },
  { comment: "Ordered the mixed box and every single cookie was incredible." },
  { comment: "The packaging alone made me smile before I even opened it!" },
  { comment: "Brown Butter Toffee is my new addiction. Send help 😂" },
  {
    comment:
      "Perfect for gifting. Everyone I've given these to has loved them.",
  },
  {
    comment:
      "Finally cookies that actually taste homemade but look professional!",
  },
  {
    comment:
      "Speedy delivery and every cookie was still perfectly soft. Impressed!",
  },
  {
    comment:
      "The Red Velvet cookie is everything. Will be back for more for sure.",
  },
  {
    comment:
      "I ordered once and now I can't stop. These cookies are dangerous 🍪",
  },
  {
    comment:
      "Best decision I made this month was trying Exynos Cooky. Highly recommend!",
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

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );
  const [activeTrending, setActiveTrending] = useState<number>(0);
  const { users: reviewUsers, loading: reviewLoading } = useSelector(
    (state: RootState) => state.reviews,
  );

  useEffect(() => {
    dispatch(fetchReviewUsers());
  }, [dispatch]);

  const carouselCookies = cookies.slice(0, 6);

  const cookieMap = useMemo(
    () => new Map(cookies.map((cookie) => [cookie.id, cookie])),
    [cookies],
  );

  const bestCookies = useMemo(
    () =>
      BEST_COOKIE_IDS.map((id) => cookieMap.get(id)).filter(
        (cookie): cookie is Cookie => !!cookie,
      ),
    [cookieMap],
  );

  const trendingCookies = useMemo(() => {
    // 1. Check for cookies matching candidate IDs
    const candidates = TRENDING_CANDIDATE_IDS.map((id) => cookieMap.get(id)).filter(
      (cookie): cookie is Cookie => !!cookie && cookie.isAvailable,
    );

    if (candidates.length >= 3) {
      return candidates.slice(0, 3);
    }

    // 2. Supplement with any other available cookies from inventory
    const others = cookies.filter(
      (c) => c.isAvailable && !candidates.some((cand) => cand.id === c.id),
    );
    const combined = [...candidates, ...others];
    if (combined.length >= 3) {
      return combined.slice(0, 3);
    }

    // 3. Guaranteed fallback to mock data to ensure at least 3 distinct cards
    const mockRemaining = COOKIE_MOCK_DATA.filter(
      (m) => m.isAvailable && !combined.some((c) => c.id === m.id),
    );
    return [...combined, ...mockRemaining].slice(0, 3);
  }, [cookies, cookieMap]);

  const handleAddToCart = (cookie: Cookie) => {
    addCookieWithFeedback(
      cookie,
      cartItems.length,
      boxSize,
      dispatch,
      messageApi,
    );
  };

  return (
    <>
      {contextHolder}
      <HomeCarousel cookies={carouselCookies} onAdd={handleAddToCart} />

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
          infinite={bestCookies.length > 1}
          swipeToSlide={true}
          responsive={CAROUSEL_RESPONSIVE_SETTINGS}
        >
          {bestCookies.map((cookie) => (
            <BestCardSlide key={cookie.id}>
              <StyledCard
                hoverable
                $isAvailable={cookie.isAvailable}
                cover={
                  <BestCoverImage
                    src={cookie.imageUrl}
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
                    onClick={() => handleAddToCart(cookie)}
                  >
                    {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                  </StyledButton>
                </BestCardBody>
              </StyledCard>
            </BestCardSlide>
          ))}
        </BestCarousel>
      </BestSection>
      <TrendingSection>
        <TrendingSectionTitle level={2}>Trending</TrendingSectionTitle>
        <SectionBadge>
          🔥 Discover what everyone is ordering right now
        </SectionBadge>
        <TrendingStack>
          {trendingCookies.map((cookie, idx) => {
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
                      handleAddToCart(cookie);
                    }}
                  >
                    {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                  </StyledButton>
                </TrendingCardBody>
              </TrendingCard>
            );
          })}
        </TrendingStack>
        {trendingCookies.length > 1 && (
          <TrendingDots>
            {trendingCookies.map((cookie, idx) => (
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

      <ReviewsSection>
        <ReviewsSectionTitle level={2}>Customer Reviews</ReviewsSectionTitle>
        <SectionBadge>
          ⭐ Real reviews from our happy cookie lovers
        </SectionBadge>

        <Spin spinning={reviewLoading}>
          <BestCarousel
            slidesToShow={4}
            slidesToScroll={2}
            dots={true}
            arrows={!isMobile}
            infinite={true}
            swipeToSlide={true}
            responsive={CAROUSEL_RESPONSIVE_SETTINGS}
          >
            {(reviewUsers.length > 0 ? reviewUsers : REVIEWS).map((review, i) => {
              const reviewer = reviewUsers[i];
              const comment = 'comment' in review && review.comment ? review.comment : REVIEWS[i]?.comment || "Delicious cookies!";
              const name = reviewer?.name ?? "Verified Customer";
              const avatar = reviewer?.avatar;
              const email = reviewer?.email ?? "";
              const rating = reviewer?.rating ?? 5;

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
    </>
  );
};

export default Home;
