import React, { useCallback, useMemo } from "react";
import { Col, message, Rate, Row, Select, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { type Cookie } from "../../../utils/mockData";
import { useSearch } from "../../../context/searchContext";
import { type RootState } from "../../../store";
import { addCookieToBox } from "../../../store/slices/cartSlice";
import { StyledInput } from "../../../components/StyledInput";
import { StyledTitle } from "../../../components/StyledTitle";
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
import { StyledCard } from "../../../components/StyledCard";

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

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { searchQuery, setSearchQuery } = useSearch();
  const { items: cookies } = useSelector((state: RootState) => state.inventory);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const filteredCookies = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return cookies.filter(
      ({ name, description }) =>
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query),
    );
  }, [cookies, searchQuery]);

  const topRatedCookies = useMemo(
    () => filteredCookies.slice(0, 3),
    [filteredCookies],
  );

  const handleAddToCart = useCallback(
    (cookie: Cookie) => {
      if (cartItems.length >= boxSize) {
        messageApi.error(
          `Your ${boxSize}-Pack is full! Clear items or upgrade your box size.`,
        );
        return;
      }

      dispatch(addCookieToBox(cookie));
      messageApi.success(`Added ${cookie.name} to your box! 🍪`);
    },
    [boxSize, cartItems.length, dispatch, messageApi],
  );

  const handleFilterChange = useCallback((value: string) => {
    console.log("Selected filter:", value);
    // Add sorting logic here
  }, []);

  const renderCookieGrid = useCallback(
    (cookieList: Cookie[], showRatings = false) => {
      if (!cookieList.length) {
        return (
          <NoResults>
            No delicious cookies match your explore query! 🍪
          </NoResults>
        );
      }

      return (
        <Row gutter={[24, 24]}>
          {cookieList.map((cookie) => {
            const ratingData = TOP_RATED_REVIEWS[cookie.id];

            return (
              <Col xs={24} sm={12} md={8} key={cookie.id}>
                <StyledCard
                  hoverable
                  $isAvailable={cookie.isAvailable}
                  cover={
                    <CoverImage
                      alt={cookie.name}
                      src={cookie.imageUrl}
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
                      {cookie.isAvailable ? `Rs. ${cookie.price}` : "Sold Out"}
                    </Tag>
                  </CardHeader>

                  {showRatings && ratingData && (
                    <RatingWrapper align="center">
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={ratingData.rating}
                      />

                      <ReviewCountText>({ratingData.reviews})</ReviewCountText>
                    </RatingWrapper>
                  )}

                  <StyledMeta description={cookie.description} />

                  <StyledButton
                    type="primary"
                    shape="round"
                    disabled={!cookie.isAvailable}
                    danger={!cookie.isAvailable}
                    onClick={() => handleAddToCart(cookie)}
                  >
                    {cookie.isAvailable ? "Add to Box" : "Unavailable"}
                  </StyledButton>
                </StyledCard>
              </Col>
            );
          })}
        </Row>
      );
    },
    [handleAddToCart],
  );

  return (
    <HomeContainer>
      {contextHolder}

      <ExploreSection>
        <StyledTitle level={1}>Explore Our Menu</StyledTitle>

        <StyledInput
          placeholder="Search a cookie"
          allowClear
          value={searchQuery}
          suffix={<SearchOutlined />}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </ExploreSection>

      <MenuTabs
        centered
        defaultActiveKey="1"
        tabBarExtraContent={
          <Select
            defaultValue="latest"
            style={{ width: 150 }}
            options={FILTER_OPTIONS}
            onChange={handleFilterChange}
          />
        }
        items={[
          {
            key: "1",
            label: "🌟 Top Rated",
            children: renderCookieGrid(topRatedCookies, true),
          },
          {
            key: "2",
            label: "🍪 All Menu",
            children: renderCookieGrid(filteredCookies),
          },
        ]}
      />
    </HomeContainer>
  );
};

export default Home;
