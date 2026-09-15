import React from "react";
import { Row, Col, Tag, Button, Empty, Typography } from "antd";
import { DownCircleTwoTone } from "@ant-design/icons";
import type { Cookie } from "../../../../types/product";
import { StyledTitle } from "../../../../components/StyledTitle";
import {
  CoverImage,
  CardHeader,
  StyledButton,
  NoResults,
  StyledMeta,
} from "../../Home/styles";
import {
  EqualCard,
  CardFooter,
  LoadMoreWrapper,
} from "../styles";

const { Text } = Typography;

interface CookieCatalogGridProps {
  visibleCookies: Cookie[];
  totalFilteredCount: number;
  hasMore: boolean;
  searchQuery: string;
  onSelectCookie: (cookie: Cookie) => void;
  onAddToCart: (cookie: Cookie) => void;
  onLoadMore: () => void;
}

export const CookieCatalogGrid: React.FC<CookieCatalogGridProps> = ({
  visibleCookies,
  totalFilteredCount,
  hasMore,
  searchQuery,
  onSelectCookie,
  onAddToCart,
  onLoadMore,
}) => {
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
                  src={cookie.imageUrl}
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

      {hasMore && (
        <LoadMoreWrapper>
          <Button
            type="dashed"
            size="large"
            icon={<DownCircleTwoTone />}
            onClick={onLoadMore}
          >
            Load More Flavors ({totalFilteredCount - visibleCookies.length} remaining)
          </Button>
        </LoadMoreWrapper>
      )}
    </>
  );
};
