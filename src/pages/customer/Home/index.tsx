import React, { useState } from "react";
import { Col, message, Rate, Row, Select, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { type Cookie } from "../../../utils/mockData";
import { type RootState } from "../../../store";
import { addCookieToBox } from "../../../store/slices/cartSlice";

import { StyledInput } from "../../../components/StyledInput";
import { StyledTitle } from "../../../components/StyledTitle";
import { StyledCard } from "../../../components/StyledCard";

import {
  HomeContainer,
  CoverImage,
  CardHeader,
  StyledButton,
  ExploreSection,
  MenuTabs,
  NoResults,
  RatingWrapper,
  ReviewCountText,
  StyledMeta,
} from "./styles";

const FILTER_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "latest", label: "Latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const TOP_RATED_REVIEWS: Record<number, { rating: number; reviews: string }> = {
  2: { rating: 5, reviews: "120+" },
  3: { rating: 5, reviews: "98" },
  4: { rating: 4.5, reviews: "84" },
};

const CookieGrid = ({
  cookies,
  showRatings,
  onAdd,
}: {
  cookies: Cookie[];
  showRatings?: boolean;
  onAdd: (cookie: Cookie) => void;
}) => {
  if (!cookies.length) {
    return (
      <NoResults>
        No delicious cookies match your search! 🍪
      </NoResults>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {cookies.map((cookie) => {
        const rating = TOP_RATED_REVIEWS[cookie.id];

        return (
          <Col xs={24} sm={12} md={8} key={cookie.id}>
            <StyledCard
              hoverable
              $isAvailable={cookie.isAvailable}
              cover={
                <CoverImage
                  src={cookie.imageUrl}
                  alt={cookie.name}
                  preview={false}
                />
              }
            >
              <CardHeader>
                <StyledTitle level={4}>{cookie.name}</StyledTitle>

                <Tag
                  color={cookie.isAvailable ? "blue" : "red"}
                  variant="solid"
                >
                  {cookie.isAvailable
                    ? `Rs. ${cookie.price}`
                    : "Sold Out"}
                </Tag>
              </CardHeader>

              {showRatings && rating && (
                <RatingWrapper align="center">
                  <Rate disabled allowHalf defaultValue={rating.rating} />
                  <ReviewCountText>
                    ({rating.reviews})
                  </ReviewCountText>
                </RatingWrapper>
              )}

              <StyledMeta description={cookie.description} />

              <StyledButton
                type="primary"
                shape="round"
                disabled={!cookie.isAvailable}
                danger={!cookie.isAvailable}
                onClick={() => onAdd(cookie)}
              >
                {cookie.isAvailable ? "Add to Box" : "Unavailable"}
              </StyledButton>
            </StyledCard>
          </Col>
        );
      })}
    </Row>
  );
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState("");

  const { items: cookies } = useSelector(
    (state: RootState) => state.inventory
  );

  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart
  );

  const filteredCookies = cookies.filter((cookie) =>
    cookie.name.toLowerCase().includes(search.toLowerCase())
  );

  const topRatedCookies = filteredCookies.slice(0, 3);

  const handleAddToCart = (cookie: Cookie) => {
    if (cartItems.length >= boxSize) {
      messageApi.error(
        `Your ${boxSize}-Pack is full! Clear items or upgrade your box size.`
      );
      return;
    }

    dispatch(addCookieToBox(cookie));
    messageApi.success(`Added ${cookie.name} to your box! 🍪`);
  };

  return (
    <HomeContainer>
      {contextHolder}

      <ExploreSection>
        <StyledTitle level={1}>Explore Our Menu</StyledTitle>

        <StyledInput
          placeholder="Search a cookie"
          allowClear
          value={search}
          suffix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
        />
      </ExploreSection>

      <MenuTabs
        centered
        defaultActiveKey="1"
        tabBarExtraContent={{
          left: (
            <Select
              defaultValue="latest"
              style={{ width: 150 }}
              options={FILTER_OPTIONS}
            />
          ),
          right: (
            <Select
              placeholder="Select box size"
              style={{ width: 150 }}
            />
          ),
        }}
        items={[
          {
            key: "1",
            label: "🌟 Top Rated",
            children: (
              <CookieGrid
                cookies={topRatedCookies}
                showRatings
                onAdd={handleAddToCart}
              />
            ),
          },
          {
            key: "2",
            label: "🍪 All Menu",
            children: (
              <CookieGrid
                cookies={filteredCookies}
                onAdd={handleAddToCart}
              />
            ),
          },
        ]}
      />
    </HomeContainer>
  );
};

export default Home;