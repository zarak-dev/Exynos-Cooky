import React, { useEffect, useRef } from "react";
import { Row, Col, Tag, Spin, Empty, Typography } from "antd";
import type { Cookie } from "@src/types/product";
import { StyledTitle } from "@src/components/StyledTitle";
import { DEFAULT_COOKIE_IMAGE } from "@src/constants";
import {
  CoverImage,
  CardHeader,
  StyledButton,
  NoResults,
  StyledMeta,
} from "@src/pages/customer/Home/styles";
import {
  EqualCard,
  CardFooter,
  LoadMoreWrapper,
} from "@src/pages/customer/BuyCooky/styles";

const { Text } = Typography;

interface CookieCatalogGridProps {
  visibleCookies: Cookie[];
  hasMore: boolean;
  searchQuery: string;
  onSelectCookie: (cookie: Cookie) => void;
  onAddToCart: (cookie: Cookie) => void;
  onLoadMore: () => void;
}

export const CookieCatalogGrid: React.FC<CookieCatalogGridProps> = ({
  visibleCookies,
  hasMore,
  searchQuery,
  onSelectCookie,
  onAddToCart,
  onLoadMore,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "350px",
        threshold: 0.1,
      },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, onLoadMore]);

  if (visibleCookies.length === 0) {
    return (
      <NoResults>
        <Empty
          description={
            <Text type="secondary">
              {searchQuery
                ? `No cookies match "${searchQuery}". Try another flavor!`
                : "No cookies available in this category."}
            </Text>
          }
        />
      </NoResults>
    );
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        {visibleCookies.map((cookie) => (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <EqualCard
              hoverable
              $isAvailable={cookie.isAvailable}
              cover={
                <CoverImage
                  src={cookie.imageUrl || DEFAULT_COOKIE_IMAGE}
                  fallback={DEFAULT_COOKIE_IMAGE}
                  alt={cookie.name}
                  preview={false}
                  loading="lazy"
                />
              }
            >
              <CardHeader justify="space-between" align="center">
                <StyledTitle level={4}>{cookie.name}</StyledTitle>
                <Tag
                  color={cookie.isAvailable ? "blue" : "red"}
                  variant="solid"
                >
                  {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                </Tag>
              </CardHeader>
              <StyledMeta description={cookie.description} />
              <CardFooter justify="space-between" align="center">
                <StyledButton
                  shape="round"
                  onClick={() => onSelectCookie(cookie)}
                >
                  View
                </StyledButton>
                <StyledButton
                  type="primary"
                  shape="round"
                  disabled={!cookie.isAvailable}
                  danger={!cookie.isAvailable}
                  onClick={() => onAddToCart(cookie)}
                >
                  {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                </StyledButton>
              </CardFooter>
            </EqualCard>
          </Col>
        ))}
      </Row>

      {hasMore ? (
        <LoadMoreWrapper
          ref={sentinelRef}
          style={{
            minHeight: 56,
            padding: "28px 0 36px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="default" />
        </LoadMoreWrapper>
      ) : visibleCookies.length > 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0 16px",
            color: "#8c8c8c",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          🍪 You've reached the end of our cookie menu
        </div>
      ) : null}
    </>
  );
};
