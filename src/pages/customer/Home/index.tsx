import React, { useEffect, useMemo, useCallback } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsRequest } from "../../../store/slices/reviewSlice";
import type { Cookie } from "../../../types";
import { type RootState } from "../../../store";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { addCookieWithFeedback } from "../../../utils/cartActions";

import HomeCarousel from "./components/HomeCarousel";
import { HomeBestSection } from "./components/HomeBestSection";
import { HomeTrendingSection } from "./components/HomeTrendingSection";
import { HomeReviewsSection } from "./components/HomeReviewsSection";

const BEST_COOKIE_IDS = [2, 3, 6, 9, 10, 4];
const TRENDING_CANDIDATE_IDS = [13, 17, 18, 3, 6, 8, 2, 7];

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );
  const { reviews, loading: reviewLoading } = useSelector(
    (state: RootState) => state.reviews,
  );

  useEffect(() => {
    dispatch(fetchReviewsRequest());
  }, [dispatch]);
  
  const carouselCookies = useMemo(() => cookies.slice(0, 6), [cookies]);

  const cookieMap = useMemo(
    () => new Map(cookies.map((cookie) => [cookie.id, cookie])),
    [cookies],
  );

  const bestCookies = useMemo(() => {
    const curated = BEST_COOKIE_IDS.map((id) => cookieMap.get(id)).filter(
      (cookie): cookie is Cookie => Boolean(cookie) && Boolean(cookie?.isAvailable),
    );
    if (curated.length >= 3) return curated;
    return cookies.filter((c) => c.isAvailable).slice(0, 6);
  }, [cookieMap, cookies]);

  const trendingCookies = useMemo(() => {
    // 1. Gather candidates from inventory matching the preferred curated list
    const candidates = TRENDING_CANDIDATE_IDS.map((id) =>
      cookieMap.get(id),
    ).filter(
      (cookie): cookie is Cookie => Boolean(cookie) && Boolean(cookie?.isAvailable),
    );

    if (candidates.length >= 3) {
      return candidates.slice(0, 3);
    }

    // 2. Supplement with any other available cookies from inventory
    const others = cookies.filter(
      (c) => c.isAvailable && !candidates.some((cand) => cand.id === c.id),
    );
    return [...candidates, ...others].slice(0, 3);
  }, [cookies, cookieMap]);

  const handleAddToCart = useCallback(
    (cookie: Cookie) => {
      addCookieWithFeedback(
        cookie,
        cartItems.length,
        boxSize,
        dispatch,
        messageApi,
      );
    },
    [cartItems.length, boxSize, dispatch, messageApi],
  );

  return (
    <>
      {contextHolder}
      <HomeCarousel cookies={carouselCookies} onAdd={handleAddToCart} />
      <HomeBestSection
        cookies={bestCookies}
        onAddToCart={handleAddToCart}
        isMobile={isMobile}
      />
      <HomeTrendingSection
        cookies={trendingCookies}
        onAddToCart={handleAddToCart}
      />
      <HomeReviewsSection
        reviews={reviews}
        loading={reviewLoading}
        isMobile={isMobile}
      />
    </>
  );
};

export default Home;
